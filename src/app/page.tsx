import BrandLogo from "@/components/common/BrandLogo";

export default async function Home() {
  
  return (
    <div className="flex flex-col gap-8 items-center py-8 px-16">
        
        <div className="banner flex flex-col items-center">
          <div className="w-64"><BrandLogo /></div>
          <p className="text-4xl font-semibold font-sans mt-2">Next.js Chart Library</p>
          <p className="descritpion text-2xl font-sans mt-8 text-center px-8 text-zinc-200">
            A collection of React chart components to be used in Next.js framework, built with D3.js.
          </p>
        </div>
    </div>
  );
}
