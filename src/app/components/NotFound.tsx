"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

type NotFoundProps = {
  title: string;
  message: string;
  image?: string;
};

export default function NotFound({ title, message, image = '/file.svg' }: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <Image
          src={image}
          alt="Not Found"
          width={80}
          height={80}
          className="not-found-image"
        />
        <h1>{title}</h1>
        <p>{message}</p>
        <button 
          onClick={() => router.push('/')}
          className="back-home-button"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
