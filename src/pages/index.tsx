import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserRole } from "~/common/types";
import { api } from "~/utils/api";

export default function Home() {

  const { data, isLoading, error } = api.stats.getLandingPageStats.useQuery();
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {

    if (session.user.role === UserRole.ADMIN) {
      router.push('/admin');
    }

    if (session.user.role === UserRole.USER) {
      router.push('/home')
    }

  }

  return (
    <>
      <Head>
        <title>Consmart</title>
      </Head>
      <main className="">

        <section className="container flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-6 items-start mx-0 py-40 max-w-2xl ">
            <h1 className="text-6xl text-primary font-bold leading-tight">We Take Your Dream Home & Make It Real!</h1>
            <p className="text-base-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae numquam eum ad neque enim ut excepturi incidunt fugiat, inventore qui esse eveniet. Minima eaque sint assumenda! Vero ipsam laborum consequatur officiis tempore, cumque corporis deleniti, illum explicabo repellat, vel perspiciatis.</p>
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
                    error?.message
                  }
                </h2>
                <p>Amazing Project{data && data.projects > 1 ? 's' : ''}</p>
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
                    error?.message
                  }
                </h2>
                <p>Happy Customer{data && data.users > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div>
            <img src={'/construction worker.jpg'} className="max-w-xl shadow-2xl hover:shadow-sm transition-all duration-200 ease-linear border-2 border-primary rounded-xl hover:rounded-none" />
          </div>
        </section>

        <section className="container bg-base-200 py-36" id="about">
          <h1 className="text-center text-6xl text-primary mb-10">About Us</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores sit obcaecati dolores modi! Autem obcaecati quis esse asperiores temporibus commodi cum inventore possimus facere neque consequuntur distinctio soluta velit odit laborum laboriosam dicta ab numquam perferendis, nisi recusandae ad voluptate vitae totam? Enim quos, numquam cumque assumenda ipsam velit unde.</p>
        </section>

        <section className="container py-36">
          <h1 className="text-center text-6xl text-primary mb-10">Our Services</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores sit obcaecati dolores modi! Autem obcaecati quis esse asperiores temporibus commodi cum inventore possimus facere neque consequuntur distinctio soluta velit odit laborum laboriosam dicta ab numquam perferendis, nisi recusandae ad voluptate vitae totam? Enim quos, numquam cumque assumenda ipsam velit unde.</p>
        </section>

      </main>
    </>
  );
}
