# @rownd/convex

A React integration between Rownd authentication and Convex backend.

## Installation

```bash
npm install @rownd/convex @rownd/react convex
```

## Setup

### 1. Configure Convex Auth

Create a `convex/auth.config.js` file in your project:

```javascript
export default {
  providers: [
    {
      domain: "https://api.rownd.io",
      applicationID: ["app:YOUR_ROWND_APP_ID"], // Replace with your Rownd app ID
    },
  ],
};
```

### 2. Set up the Provider

Wrap your app with the `RowndProvider` from `@rownd/convex/react`:

```tsx
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { RowndProvider } from "@rownd/convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <RowndProvider
    client={convex}
    appKey="YOUR_ROWND_APP_KEY" // Replace with your Rownd app key
  >
    <App />
  </RowndProvider>
);
```

### 3. Create a User Store Effect

Create a custom hook to store the authenticated user in your Convex database:

```tsx
import { useRownd } from "@rownd/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useRownd();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser().catch(console.error);
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.data.user_id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
```

## Usage

The `useStoreUserEffect` hook provides authentication state that you can use throughout your application:

```tsx
function App() {
  const { isLoading, isAuthenticated } = useStoreUserEffect();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome to your authenticated app!</div>;
}
```

## API Reference

### RowndProvider Props

| Prop | Type | Description |
|------|------|-------------|
| client | ConvexReactClient | Your Convex client instance |
| appKey | string | Your Rownd app key |

### useStoreUserEffect Hook

Returns an object with:
- `isLoading`: boolean - Whether the authentication state is being determined
- `isAuthenticated`: boolean - Whether the user is authenticated and stored in Convex
