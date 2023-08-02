import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserRole } from "~/common/types";
import { api } from "~/utils/api";

export default function Home() {
  const { data, isLoading, error } = api.stats.getLandingPageStats.useQuery();

  return (
    <>
      <Head>
        <title>Consmart</title>
      </Head>
      <main className="">

        <section className="flex items-center gap-10 justify-center flex-wrap py-40">
          <div className="flex flex-col gap-6 items-start mx-0 max-w-2xl ">
            <h1 className="text-6xl text-primary font-bold leading-tight">We Take Your Dream Home & Make It Real!</h1>
            <p className="text-base-content">With a user-friendly interface and powerful features, it empowers construction professionals to drive efficiency and success in their projects. Experience the future of construction management with our innovative system.</p>
            <div className="flex gap-4">
              <Link href={'api/auth/signin'} className="btn btn-active btn-primary">Get Started</Link>
              <Link href={'#about'} className="btn btn-outline btn-primary">Explore More</Link>
            </div>
            <div className="flex gap-6">
              <div className="max-w-[80px]">
                <h2 className="font-bold text-4xl text-secondary">
                  {
                    isLoading &&
                    <span className="loading loading-ring loading-lg"></span>
                  }
                  {
                    data?.projects
                  }
                  {
                    error && 0
                  }
                </h2>
                <p>Amazing Project{data && data.projects > 1 ? 's' : ''}{error && 's'}{isLoading && 's'}</p>
              </div>
              <div className="max-w-[80px]">
                <h2 className="font-bold text-4xl text-accent">
                  {
                    isLoading &&
                    <span className="loading loading-ring loading-lg"></span>
                  }
                  {
                    data?.users
                  }
                  {
                    error && 0
                  }
                </h2>
                <p>Happy Customer{data && data.users > 1 ? 's' : ''}{error && 's'}{isLoading && 's'}</p>
              </div>
            </div>
          </div>

          <div>
            <img src={'/construction worker.jpg'} className="max-w-xl shadow-2xl hover:shadow-sm transition-all duration-200 ease-linear border-4 border-primary rounded-xl hover:rounded-none" />
          </div>
        </section>

        <section className="bg-base-200 py-36" id="about">
          <div className="container">
            <h1 className="text-center text-6xl text-primary mb-10">About Us</h1>
            <p>Welcome to our platform! We are a dynamic team of students from CPU College, driven by a shared passion for technology and a desire to make a difference in the construction industry. Our mission is to provide an advanced construction management system that simplifies project workflows and boosts productivity. Through extensive research and development, we have created a comprehensive solution that covers everything from project planning and scheduling to resource allocation and cost tracking. Our user-friendly platform is designed to empower construction professionals, enhance collaboration, and drive efficiency. Join us as we revolutionize construction management and pave the way for a brighter future in the industry.</p>
          </div>
        </section>

        <section className="py-36">
          <div className="container">
            <h1 className="text-center text-6xl text-primary mb-10">Our Services</h1>
            <p>Welcome to our platform! We are a dynamic team of students from CPU College, driven by a shared passion for technology and a desire to make a difference in the construction industry. Our mission is to provide an advanced construction management system that simplifies project workflows and boosts productivity. Through extensive research and development, we have created a comprehensive solution that covers everything from project planning and scheduling to resource allocation and cost tracking. Our user-friendly platform is designed to empower construction professionals, enhance collaboration, and drive efficiency. Join us as we revolutionize construction management and pave the way for a brighter future in the industry.</p>
          </div>
        </section>

      </main>
    </>
  );
}
