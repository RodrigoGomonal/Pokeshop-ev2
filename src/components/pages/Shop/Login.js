import React from "react";
import MainLayout from "../../templates/MainLayout";
import LoginSection from "../../organisms/LoginSection";

export default function Login(){
  return (
    <MainLayout>
        <div className="container mt-4">
            <LoginSection />
        </div>
    </MainLayout>
  );
}