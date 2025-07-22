"use client";
import { ICategory } from '../../types/types'
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  category: ICategory;
}

function HomeCard({ category }: Props) {
  const router = useRouter();

  return (
    <div
      className="bg-card text-card-foreground border-2 border-border rounded-xl p-1 cursor-pointer 
        shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.05)]
        hover:-translate-y-1 hover:shadow-[0_.4rem_0_0_rgba(0,0,0,0.15)] 
        dark:hover:shadow-[0_.4rem_0_0_rgba(255,255,255,0.1)]
        transition-all duration-300 ease-in-out"
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      <div className="rounded-xl h-[9rem] py-1 overflow-hidden flex items-center justify-center">
        <Image
          src={
            category.image
              ? category.image
              : `/categories/image--${category.name
                  .toLowerCase()
                  .split(" ")
                  .join("-")}.svg`
          }
          width={300}
          height={200}
          alt={category.name}
          className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
          style={{ height: 'auto', width: 'auto' }}
          priority
        />
      </div>

      <div className="py-2 px-6 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
          <p className="text-muted-foreground text-sm leading-none font-semibold">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;