import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import axios from "axios";

const corsHandler = cors({origin: true});

// Define secrets - will use Secret Manager in production, .env locally
const spotifyClientId = defineSecret("SPOTIFY_CLIENT_ID");
const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

interface TokenRequest {
  code: string;
  redirectUri: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export const exchangeSpotifyToken = onRequest(
  {secrets: [spotifyClientId, spotifyClientSecret]},
  (req, res) => {
    corsHandler(req, res, async () => {
      // Only allow POST requests
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const {code, redirectUri} = req.body as TokenRequest;

      if (!code || !redirectUri) {
        logger.warn("Missing code or redirectUri in request");
        res.status(400).json({error: "Missing code or redirectUri"});
        return;
      }

      // Get secrets - uses Secret Manager in production, .env locally
      const clientId = spotifyClientId.value();
      const clientSecret = spotifyClientSecret.value();

      if (!clientId || !clientSecret) {
        logger.error("Spotify credentials not configured");
        res.status(500).json({error: "Server configuration error"});
        return;
      }

    try {
      // Exchange code for token
      const tokenResponse = await axios.post<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      logger.info("Successfully exchanged Spotify token");

      // Return tokens to client
      res.json({
        access_token: tokenResponse.data.access_token,
        token_type: tokenResponse.data.token_type,
        expires_in: tokenResponse.data.expires_in,
        refresh_token: tokenResponse.data.refresh_token,
        scope: tokenResponse.data.scope,
      });
    } catch (error: any) {
      logger.error("Token exchange error:", error.response?.data || error.message);
      res.status(500).json({
        error: "Failed to exchange token",
        details: error.response?.data?.error_description || "Unknown error",
      });
    }
    });
  }
);

export const refreshSpotifyToken = onRequest(
  {secrets: [spotifyClientId, spotifyClientSecret]},
  (req, res) => {
    corsHandler(req, res, async () => {
      // Only allow POST requests
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const {refreshToken} = req.body as RefreshTokenRequest;

      if (!refreshToken) {
        logger.warn("Missing refreshToken in request");
        res.status(400).json({error: "Missing refreshToken"});
        return;
      }

      // Get secrets - uses Secret Manager in production, .env locally
      const clientId = spotifyClientId.value();
      const clientSecret = spotifyClientSecret.value();

      if (!clientId || !clientSecret) {
        logger.error("Spotify credentials not configured");
        res.status(500).json({error: "Server configuration error"});
        return;
      }

    try {
      // Refresh the access token
      const tokenResponse = await axios.post<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      logger.info("Successfully refreshed Spotify token");

      // Return tokens to client
      res.json({
        access_token: tokenResponse.data.access_token,
        token_type: tokenResponse.data.token_type,
        expires_in: tokenResponse.data.expires_in,
        refresh_token: tokenResponse.data.refresh_token,
      });
    } catch (error: any) {
      logger.error("Token refresh error:", error.response?.data || error.message);
      res.status(500).json({
        error: "Failed to refresh token",
        details: error.response?.data?.error_description || "Unknown error",
      });
    }
    });
  }
);
