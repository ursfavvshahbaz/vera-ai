import Vapi from "@vapi-ai/web";

// Confirm karo ki ye "Public Key" hai (Private nahi)
export const VAPI_PUBLIC_KEY = "fd9b7d6e-9c8c-49ea-b77a-8829016bc973"; 

// Confirm karo ki ye aapke Assistant ki ID hai
export const VERA_ID = "6f8b9347-860a-48c7-9377-9aa5423e70f6";

// SSR check ke saath initialize karein
export const vapi = typeof window !== "undefined" ? new Vapi(VAPI_PUBLIC_KEY) : null;