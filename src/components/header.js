import React from 'react';
import Link from 'next/link';

const Header = () => (
  <nav className="flex items-center justify-between flex-wrap pb-6 border-b my-6">
    <div className="flex items-center flex-shrink-0 mr-6 w-full text-center sm:text-left sm:mr-0 sm:mt-0 sm:w-auto">
      <h1 className="text-3xl font-bold tracking-tight w-full text-center sm:w-auto">
        <Link href="/">
          <a className="no-underline text-gray-800 hover:text-black">
            Contratos de Puerto Rico
          </a>
        </Link>
      </h1>
    </div>
    <div className="flex mt-2 w-full text-center sm:text-left sm:mt-0 sm:w-auto">
      <div className="flex-grow">
        <Link href="/buscar">
          <a className="mr-4 no-underline font-bold inline-block text-gray-800 hover:text-black hover:underline">
            Buscar
          </a>
        </Link>
        <Link href="/entidades">
          <a className="mr-4 no-underline font-bold inline-block text-gray-800 hover:text-black hover:underline">
            Entidades
          </a>
        </Link>
        <Link href="/contratistas">
          <a className="mr-4 no-underline font-bold inline-block text-gray-800 hover:text-black hover:underline">
            Contratistas
          </a>
        </Link>
        <Link href="/tendencias">
          <a className="mr-4 no-underline font-bold inline-block text-gray-800 hover:text-black hover:underline">
            Tendencias
          </a>
        </Link>
        <Link href="/sobre-nosotros">
          <a className="no-underline font-bold inline-block text-gray-800 hover:text-black hover:underline">
            Sobre Nosotros
          </a>
        </Link>
      </div>
    </div>
  </nav>
);

export default React.memo(Header);
