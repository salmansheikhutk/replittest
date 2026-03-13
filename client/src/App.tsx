import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Home } from "@/pages/Home";
import { CategoryView } from "@/pages/CategoryView";
import { LessonView } from "@/pages/LessonView";
import { Glossary } from "@/pages/Glossary";

function Router() {
  return (
    <div className="flex flex-col min-h-screen flex-1 w-full">
      <Navbar />
      <main className="flex-1 w-full">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/learn/:category/:level" component={CategoryView} />
          <Route path="/lesson/:id" component={LessonView} />
          <Route path="/glossary" component={Glossary} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
