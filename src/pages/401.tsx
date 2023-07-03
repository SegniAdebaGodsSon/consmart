import { NextPage } from "next";
import Link from "next/link";
import React from "react";
const Custom401: NextPage = () => {
    return (
        <div className="container">
            <div className="grid place-content-center min-h-screen">
                <div className="flex flex-col items-center">
                    <div className="my-4 text-center">
                        <h1 className="text-2xl">401 - Unauthenticatred</h1>
                        <p className="">Please login</p>
                    </div>
                    <Link className="btn btn-primary" href="/api/auth/signin">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Custom401;


