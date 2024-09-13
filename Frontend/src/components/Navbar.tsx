'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SupportModal from './SupportModal'; // Assurez-vous que le chemin est correct

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <nav>
      <ul style={{ display: 'flex', listStyleType: 'none', justifyContent: 'space-around', padding: 0, alignItems: 'center' }}>
        <li style={{ flexShrink: 0 }}>
          <Link href="/ui/home" style={{ display: 'inline-block' }}>
            <Image 
              src="/assets/icone_logo.svg" 
              alt="Logo" 
              width={150} 
              height={100} 
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </li>
        <li style={{ fontSize: '20px', marginLeft: '15px' }}>
          <Link href="/ui/actualites" style={{ textDecoration: 'none', color: 'inherit' }}>
            Actualité
          </Link>
        </li>
        <li style={{ fontSize: '20px', margin: '0 15px' }}>
          <Link href="/ui/home#about-us" style={{ textDecoration: 'none', color: 'inherit' }}>
            About
          </Link>
        </li>
        <li style={{ fontSize: '20px', margin: '0 15px' }}>
          <Link href="/ui/home/#mediatheque" style={{ textDecoration: 'none', color: 'inherit' }}>
            Médiathèque
          </Link>
        </li>
        <li style={{ fontSize: '20px', margin: '0 15px' }}>
          <button
            onClick={openModal}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '20px' }}
          >
            Support
          </button>
        </li>
        <li style={{ fontSize: '20px', margin: '0 15px' }}>
          <Link href="/auth/sign-in" style={{ textDecoration: 'none', color: 'inherit' }}>
            Log In
          </Link>
        </li>
        <li style={{ margin: '0 20px' }}>
          <Link href="/auth/sign-in" style={{ textDecoration: 'none' }}>
            <button style={{ fontSize: '20px', padding: '15px 30px', backgroundColor: '#007cb9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Get Started
            </button>
          </Link>
        </li>
      </ul>
      <SupportModal open={isModalOpen} onClose={closeModal} />
    </nav>
  );
};

export default Navbar;
