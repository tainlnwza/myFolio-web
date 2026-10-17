import { createClient } from "@supabase/supabase-js";

// Supabase Project Ref & Base URL from User's dashboard link
export const SUPABASE_PROJECT_ID = "jcqzhwagwlihzrxfrdqr";
export const SUPABASE_DEFAULT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_BUCKET_NAME = "database myfolio";
export const SUPABASE_FOLDER_CERTS_AWARDS = "cer & award";
export const SUPABASE_FOLDER_ACTIVITIES = "activity pic&clip";

// Read anon key from env or localStorage
export const getSupabaseAnonKey = () => {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    localStorage.getItem("folio_supabase_anon_key") ||
    ""
  );
};

export const setSupabaseAnonKey = (key) => {
  if (key) {
    localStorage.setItem("folio_supabase_anon_key", key.trim());
  } else {
    localStorage.removeItem("folio_supabase_anon_key");
  }
};

export const getSupabaseUrl = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    localStorage.getItem("folio_supabase_url") ||
    SUPABASE_DEFAULT_URL
  );
};

export const setSupabaseUrl = (url) => {
  if (url) {
    localStorage.setItem("folio_supabase_url", url.trim());
  } else {
    localStorage.removeItem("folio_supabase_url");
  }
};

// Singleton Client
let clientInstance = null;
let currentKey = null;

export const getSupabaseClient = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) return null;

  if (clientInstance && currentKey === key) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(url, key);
    currentKey = key;
    return clientInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
};

export const isSupabaseConfigured = () => {
  return Boolean(getSupabaseAnonKey());
};

/**
 * Uploads a file (image or video) directly to Supabase Storage.
 * @param {File} file - The file to upload.
 * @param {string} folder - 'cer & award' or 'activity pic&clip'
 * @returns {Promise<string>} Public URL of the uploaded file.
 */
export const uploadFileToSupabase = async (file, folder = SUPABASE_FOLDER_CERTS_AWARDS) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "ยังไม่ได้เชื่อมต่อ Supabase Anon Key กรุณาระบุ VITE_SUPABASE_ANON_KEY ใน .env หรือตั้งค่าในหน้า Control Center (Admin)"
    );
  }

  // Create clean safe unique filename
  const rawExt = file.name && file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
  const ext = rawExt ? `.${rawExt}` : (file.type && file.type.startsWith("video/") ? ".mp4" : ".jpg");
  const baseName = file.name
    ? file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40)
    : "upload";
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fileName = `${uniqueId}_${baseName}${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined
    });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw error;
  }

  // Retrieve public URL
  const { data: publicData } = supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!publicData || !publicData.publicUrl) {
    throw new Error("ไม่สามารถสร้าง Public URL จาก Supabase ได้ กรุณาตรวจสอบว่า Bucket ถูกตั้งค่าเป็น Public");
  }

  return publicData.publicUrl;
};

/**
 * Tests connection to Supabase and verifies the bucket access.
 */
export const testSupabaseConnection = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: "ยังไม่ได้ระบุ Supabase Anon Key" };
  }
  try {
    const { data, error } = await supabase.storage.from(SUPABASE_BUCKET_NAME).list("", { limit: 1 });
    if (error) {
      return { success: false, message: `การเชื่อมต่อไม่สำเร็จ: ${error.message}` };
    }
    return { success: true, message: `เชื่อมต่อสำเร็จ! เข้าถึง Bucket "${SUPABASE_BUCKET_NAME}" เรียบร้อย` };
  } catch (err) {
    return { success: false, message: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}` };
  }
};

