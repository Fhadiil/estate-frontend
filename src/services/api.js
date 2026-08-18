// Mock API layer to make frontend standalone for demo purposes
import {
  users as initialUsers,
  properties as initialProperties,
  enquiries as initialEnquiries,
} from "../mock/data";

// We'll persist modifications in localStorage so demo state survives reloads
const STORAGE_KEYS = {
  USERS: "demo_users_v1",
  PROPERTIES: "demo_properties_v1",
  ENQUIRIES: "demo_enquiries_v1",
};

const load = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback.slice();
};

let users = load(STORAGE_KEYS.USERS, initialUsers);
let properties = load(STORAGE_KEYS.PROPERTIES, initialProperties);
let enquiries = load(STORAGE_KEYS.ENQUIRIES, initialEnquiries);

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const paginate = (items, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  return { results, count: items.length };
};

const parseQuery = (queryString) => {
  const params = {};
  if (!queryString) return params;
  const pairs = queryString.replace(/^\?/, "").split("&");
  for (const p of pairs) {
    if (!p) continue;
    const [k, v] = p.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  }
  return params;
};

const mockApi = {
  get: async (url) => {
    // support url like 'properties/', 'properties/?page=1', 'properties/1/'
    const [path, qs] = url.split("?");
    if (path.startsWith("properties")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length === 1) {
        const params = parseQuery(qs);
        const page = parseInt(params.page || "1", 10);
        // simple filters
        let results = properties.slice();
        if (params.search) {
          const s = params.search.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(s) ||
              p.location.toLowerCase().includes(s),
          );
        }
        if (params.property_type)
          results = results.filter(
            (p) => p.property_type === params.property_type,
          );
        if (params.status)
          results = results.filter((p) => p.status === params.status);
        return Promise.resolve({ data: paginate(results, page, 10) });
      }
      // property detail
      if (parts.length >= 2) {
        const id = parseInt(parts[1], 10);
        const prop = properties.find((p) => p.id === id) || null;
        return Promise.resolve({ data: prop });
      }
    }

    if (path.startsWith("enquiries")) {
      // return all enquiries in paginated shape
      const params = parseQuery(qs);
      const page = parseInt(params.page || "1", 10);
      // optionally filter by current user
      let items = enquiries.slice();
      if (params.user)
        items = items.filter((e) => String(e.user) === String(params.user));
      const paged = paginate(items, page, 10);
      return Promise.resolve({ data: paged });
    }

    if (path === "dashboard/admin/stats/" || path === "dashboard/admin/stats") {
      const total_properties = properties.length;
      const available_properties = properties.filter(
        (p) => p.status === "AVAILABLE",
      ).length;
      const sold_properties = properties.filter(
        (p) => p.status === "SOLD",
      ).length;
      const rented_properties = properties.filter(
        (p) => p.status === "RENTED",
      ).length;
      const total_clients = users.filter((u) => u.role === "CLIENT").length;
      const total_enquiries = enquiries.length;
      const recent_enquiries = enquiries
        .slice()
        .reverse()
        .slice(0, 10)
        .map((e) => ({
          ...e,
          user__full_name:
            (users.find((u) => u.id === e.user) || {}).full_name || "Unknown",
          property__title:
            (properties.find((p) => p.id === e.property) || {}).title ||
            "Unknown",
        }));
      return Promise.resolve({
        data: {
          total_properties,
          available_properties,
          sold_properties,
          rented_properties,
          total_clients,
          total_enquiries,
          recent_enquiries,
        },
      });
    }

    if (
      path === "dashboard/client/stats/" ||
      path === "dashboard/client/stats"
    ) {
      const current = mockApi.currentUser();
      if (!current)
        return Promise.resolve({
          data: {
            total_enquiries: 0,
            pending_enquiries: 0,
            responded_enquiries: 0,
          },
        });
      const userEnquiries = enquiries.filter((e) => e.user === current.id);
      const total_enquiries = userEnquiries.length;
      const pending_enquiries = userEnquiries.filter(
        (e) => e.status === "PENDING",
      ).length;
      const responded_enquiries = userEnquiries.filter(
        (e) => e.status !== "PENDING",
      ).length;
      return Promise.resolve({
        data: { total_enquiries, pending_enquiries, responded_enquiries },
      });
    }

    // default empty
    return Promise.resolve({ data: null });
  },

  post: async (url, payload) => {
    if (url === "auth/login/" || url === "auth/login") {
      const { email, password } = payload;
      const user = users.find(
        (u) =>
          (u.email === email || u.username === email) &&
          u.password === password,
      );
      if (!user)
        return Promise.reject({
          response: { status: 401, data: { detail: "Invalid credentials" } },
        });
      // return a simple payload with user and dummy tokens
      const access = "demo-access-token";
      const refresh = "demo-refresh-token";
      // persist current user
      localStorage.setItem("demo_current_user", JSON.stringify(user));
      return Promise.resolve({ data: { user, access, refresh } });
    }

    if (url === "auth/register/" || url === "auth/register") {
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        ...payload,
        created_at: new Date().toISOString(),
      };
      users.push(newUser);
      save(STORAGE_KEYS.USERS, users);
      return Promise.resolve({ data: newUser });
    }

    if (url === "enquiries/" || url === "enquiries") {
      const current = mockApi.currentUser();
      const newId = enquiries.length
        ? Math.max(...enquiries.map((e) => e.id || 0)) + 1
        : 1;
      const newEnquiry = {
        id: newId,
        ...payload,
        user: current ? current.id : null,
        status: "PENDING",
        created_at: new Date().toISOString(),
      };
      enquiries.push(newEnquiry);
      save(STORAGE_KEYS.ENQUIRIES, enquiries);
      return Promise.resolve({ data: newEnquiry });
    }

    // allow creating properties for demo via admin endpoints
    if (url.startsWith("properties")) {
      const parts = url.split("/").filter(Boolean);
      if (url === "properties/" || url === "properties") {
        const newId = properties.length
          ? Math.max(...properties.map((p) => p.id)) + 1
          : 1;
        const newProp = {
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        };
        properties.push(newProp);
        save(STORAGE_KEYS.PROPERTIES, properties);
        return Promise.resolve({ data: newProp });
      }
    }

    return Promise.resolve({ data: null });
  },

  // helper to get current demo user
  currentUser: () => {
    const raw = localStorage.getItem("demo_current_user");
    return raw ? JSON.parse(raw) : null;
  },

  logout: () => {
    localStorage.removeItem("demo_current_user");
  },
};

export default mockApi;
