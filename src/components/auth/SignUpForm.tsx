"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronDownIcon, ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Select from "../form/Select";
import { authService } from "@/services/auth";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName:'',
    lastName:'',
    contact:'',
    role:""

  });
  const router= useRouter();
  const [error, setError]= useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    setLoading(true);

    try {
      const user = await authService.register(formData);
      console.log('Utilisateur inscrit :', user);

      // Connexion automatique
      const { access_token } = await authService.login(formData.email, formData.password);
      console.log('Token après inscription :', access_token);

      alert('Inscription réussie, bienvenue !');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur pendant l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const options = [
      { value: "admin", label: "Administrateur" },
      { value: "teacher", label: "Enseignant" },
      { value: "canteen_manager", label: "Responsable de cantine" },
    ];
  
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setFormData({ ...formData, role: value });
  };


  
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Retourner vers Home
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6 sm:mt-2">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              Inscrivez-vous!
            </h1>
            {/* <p className="text-lg text-gray-600 mb-6 mt-4 text-center">
              Veillez remplir le formulaire pour accéder au cantine scolaire </p>
             */}
          </div>
          <div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Votre nom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Saisir votre nom"
                      defaultValue={formData.firstName}
                      onChange={(e)=> setFormData({ ...formData, firstName: e.target.value})}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Votre prénom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Saisir votre prénom"
                      defaultValue={formData.lastName}
                      onChange={(e)=> setFormData({ ...formData, lastName: e.target.value})}
                    />
                  </div>
                  {/* <!-- Contact --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Contact téléphonique<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="+261 3..."
                      defaultValue={formData.contact}
                      onChange={(e)=> setFormData({ ...formData, contact: e.target.value})}
                    />
                  </div>
                  {/* <!-- Role --> */}
                  <div className="sm:col-span-1">
                    <Label>Rôle</Label>
                    <div className="relative">
                      <Select
                        options={options}
                        placeholder="Selectionner le role"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <ChevronDownIcon/>
                        </span>
                    </div>
                  </div>
                  {/* <!-- Email --> */}
                  <div className="sm:col-span-1">
                    <Label>
                    Votre adresse Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Votre email"
                    defaultValue={formData.email}
                      onChange={(e)=> setFormData({ ...formData, email: e.target.value})}
                  />
                  </div>
                  {/* <!-- Password --> */}
                  <div className="sm:col-span-1">
                    <Label>
                    Votre mot de pass<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        defaultValue={formData.password}
                        onChange={(e)=> setFormData({ ...formData, password: e.target.value})}
                        type={showPassword ? "text" : "password"}
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
                </div>
                
                
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-4 mt-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" type="submit">
                    S'inscrire
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Tu as déjà un compte ? {"   "} {""}{""}
                <Link
                  href="/"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                   Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
