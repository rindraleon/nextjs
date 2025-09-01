
"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Metadata } from "next";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { authService } from "@/services/auth";


// export const metadata: Metadata = {
//   title:
//     "Authentification | Cantine scolaire",
//   description: "Gestion de presence et de suivi de cantine scolaire",
// };

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authService.login(email, password);
      console.log('Réponse du login :', response);

      const { user, access_token } = response;
      router.push('/dashboard');
      console.log('Redirection effectuée');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="flex flex-col flex-1  w-full  from-green-300">   
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6 sm:mt-6">
            <h1 className="mb-2 font-semibold text-gray-900 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              Bienvenue
            </h1>
            <p className="text-lg text-gray-500 mb-6 mt-6 text-center">
              Veillez saisir votre adresse email et mot de passe pour l'authentification </p>  
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">             
            </div>           
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 ">
                <div className="text-lg text-gray-100">
                  <Label>Email <span className="text-error-500">*</span>{" "}</Label>
                  <Input type="email" defaultValue={email} onChange={e => setEmail(e.target.value)}
                    placeholder="info@gmail.com"  
                  />
                </div>
                <div className="text-lg text-gray-100">
                  <Label >Mot de passe <span className="text-error-500">*</span>{" "}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="*********"
                      defaultValue={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Souviens de moi
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
                <div>
                  <Button className="w-full"  size="sm">
                    S'authentifier
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5 items-center justify-center">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Pas de compte ? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
      <footer className="mt-12 mb-15 text-center text-gray-400 text-sm">&copy; {new Date().getFullYear()} Jedyth. Tous droits réservés.</footer>
    </div>
    
  );
}

