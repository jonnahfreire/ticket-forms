import { useState, useEffect } from "react";

import Logo from "../assets/ticket-printer.png";
import tw from "tailwind-styled-components";
import { FormItemWrapper } from "../pages/ClientForm";

import { routes } from "../constants";

const Header = tw.div`
  flex
  flex-row
  items-center
  justify-between
  w-full
  h-140
  p-4
  shadow-md
`;
const HeaderContent = tw.div`
  flex  
  flex-row
  items-center
  justify-start
`;
const VerticalDivider = tw.div`
  border
  mr-2
  w-[.2rem]
  h-full
  bg-[#1b1d37]
`;
const HeaderTitleContent = tw.div`
  flex
  flex-col
`;

export const AppHeader = () => {
  return (
    <Header className="mb-10">
      <HeaderContent>
        <img src={Logo} alt="" className="mr-2" width={70} />
        <VerticalDivider />

        <HeaderTitleContent>
          <p className="font-bold text-[#1b1d37]">DF GRAVATAS</p>
          <p className="font-regular text-sm text-[#1b1d37]">Forms</p>
        </HeaderTitleContent>
      </HeaderContent>
      {location.href.endsWith("tickets") ? (
        <FormItemWrapper>
          <button className="bg-[#1b1d37] p-2 rounded">
            <a href={routes.form} className="text-white">
              Gerar
            </a>
          </button>
        </FormItemWrapper>
      ) : location.href.endsWith("form") ? (
        <FormItemWrapper>
          <button className="bg-[#1b1d37] p-2 rounded">
            <a href={routes.tickets} className="text-white">
              Etiquetas
            </a>
          </button>
        </FormItemWrapper>
      ) : (
        <></>
      )}
    </Header>
  );
};
