import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import axios from "axios";

const baseURL = "https://platform.fatsecret.com/rest/server.api";

const testToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4NDUzNUJFOUI2REY5QzM3M0VDNUNBRTRGMEJFNUE2QTk3REQ3QkMiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJTRVUxdnB0dC1jTno3Rnl1VHd2bHBxbDkxN3cifQ.eyJuYmYiOjE3MTA1NDU4MjgsImV4cCI6MTcxMDYzMjIyOCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJkMjRkZmE4OTM0NDg0N2I2ODliNDFlYmM3YzFmMTNmZiIsInNjb3BlIjpbImJhc2ljIl19.uua10jGZEz6xhdi0Fv35142y_ShoIefsPcsV7v5_nAFS8BOac-9ARQR_DKvTA-uKKJuhsshOJB-aoPiPET8tVEZZ182rb7vkmz9Mb4kbErHMrae5VhfWA04sdSuxun2rE77SAGs63NmcEkb5Z7r8LDzaZG9qLgCGhLGOr_AjY-wgeaFpU9i9qgUmrNlFJOqDz4WkKWxKqjrb7UzQNM1pi672inNVB2h7-EKIPMnRZZGEv-qgeUE8ElUTANBtPT7c3uRu3hvRbeo_GOr-VI3SvKDRARDgsUCxeOvp0prjrA03rCNTOmzdzGS0FI2Aub-YSSghQeSpPie6Rai-CjrS3A";

interface AccessInfo {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export const searchFoodbyName = asyncHandler(
  async (req: Request<{}, {}, {}>, res) => {
    const { query, max_results } = req.query;
    // const token = req.headers.authorization;
    const cookie = req.headers.cookie;

    if (!cookie) {
      res.status(401).json({ code: 10, error: "No auth" });
      return;
    }

    const jwtToken = cookie.split("=")[1];

    const url = `${baseURL}?method=foods.search&search_expression=${query}&format=json&page_number=0&max_results=${max_results}`;

    const { data } = await axios.post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (data.error) {
      res.status(401).json(data.error);
      return;
    }

    res.status(200).send(data ?? []);

    try {
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const getFoodbyId = asyncHandler(
  async (req: Request<{}, {}, {}>, res) => {
    const { food_id } = req.query;
    // const token = req.headers.authorization;

    const cookie = req.headers.cookie;
    if (!cookie) {
      res.status(401).send("No Auth");
      return;
    }

    const jwtToken = cookie.split("=")[1];

    const url = `${baseURL}?method=food.get.v3&food_id=${food_id}&format=json`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      res.status(200).send(data ?? []);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const getAccessToken = asyncHandler(
  async (req: Request<{}, {}, {}>, res) => {
    const config = new URLSearchParams();
    config.append("grant_type", "client_credentials");
    config.append("scope", "basic");

    const authorize = {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const url = "https://oauth.fatsecret.com/connect/token";

    const { data } = await axios.post<AccessInfo>(url, config, authorize);

    res.cookie("API_access", data.access_token, {
      httpOnly: true,
    });

    res.status(200).send(data ?? []);

    try {
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);
