import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGuard } from './components/auth/AuthGuard';
import { MealPlanPage } from './pages/MealPlanPage';
import { GroceryPage } from './pages/GroceryPage';
import { RecipesPage } from './pages/RecipesPage';
import { NutritionPage } from './pages/NutritionPage';
import { PantryPage } from './pages/PantryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route element={<AppShell />}>
            <Route path="/" element={<MealPlanPage />} />
            <Route path="/grocery" element={<GroceryPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/pantry" element={<PantryPage />} />
          </Route>
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
