import { Router } from "express";
import supabase from "../utils/connectDB.js";
import { generateApiKey } from "../utils/generateKey.js";
import { uuidv7 } from "uuidv7";
import bcrypt from "bcrypt";
import type { apiKeys, Tenants } from "../utils/types.js";
import { generateRefreshToken, hashToken } from "../utils/tokens.js";

const authRouter: Router = Router();

authRouter.post("/register", async (req, res) => {
  const { org_name, email, password } = req.body;
  try {
    if (!org_name || !email || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete Details" });

    const { data: existingData, error: existingError } = await supabase
      .from("tenants")
      .select()
      .eq("email", email);

    if (existingData && existingData.length >= 1) {
      // i chained it because without the first part it was giving a ts error about it possibly being null, so that is just making sure it's not null before checking if it has children
      console.log(existingData);
      return res.status(409).send({
        status: "error",
        message: "User Already Exists",
        existingData,
      });
    }

    const saltRounds = 10; // 20 will crash/inifinte loop your app
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const key = generateApiKey();
    const hashedKey = await bcrypt.hash(key, saltRounds);
    const newTenant: Tenants = {
      id: uuidv7(),
      org_name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    };
    const { data, error } = await supabase
      .from("tenants")
      .insert(newTenant)
      .select();

    if (error) return res.status(404).send({ status: "error", message: error });
    const newKey: apiKeys = {
      id: uuidv7(),
      tenant_id: newTenant.id,
      tenant_key: hashedKey,
      is_active: true,
      created_at: new Date(),
    };
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api-keys")
      .insert(newKey)
      .select();

    if (apiKeyError)
      return res.status(404).send({ status: "error", message: apiKeyError });

    return res.status(201).send({
      status: "success",
      message: "User Created!",
      data,
      apiKeyData,
    });
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(400)
      .send({ status: "error", message: "asdsdasdas", error });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete Details" });

    const { data: userData, error: userError } = await supabase
      .from("tenants")
      .select()
      .eq("email", email)
      .single();

    if (userError)
      return res.status(409).send({ status: "error", message: userError });

    const passCheck = bcrypt.compare(password, userData.password);

    if (!passCheck)
      return res
        .status(400)
        .send({ status: "error", message: "Incorrect Password" });

    const refreshToken = generateRefreshToken(userData.id);
    const hashedToken = hashToken(refreshToken);

    return res.status(200).send({
      status: "success",
      message: "User Logged In",
      hashedToken,
      refreshToken,
      userData,
    });
  } catch (error: unknown) {
    console.error(error);
  }
});
export default authRouter;
