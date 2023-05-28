import { useEffect, useState } from "react";
import { DataProps, getTickets } from "../services/TicketService";
import { LoadingWrapper, Wrapper } from "./ClientForm";

import Loading from "../assets/loading.gif";

import "../components/utils/custom-scrollbar.css";

export const Tickets = () => {
  const [tickets, setTickets] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const heading = [
    "Nome",
    "Documento",
    "Valor",
    "Cliente Enviou",
    "Status",
    // "Ações",
  ];

  async function getAllTickets() {
    const response = await getTickets();
    setTickets(response);

    setIsLoading(false);
  }

  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <Wrapper className="align-start">
      {isLoading && (
        <LoadingWrapper>
          <img src={Loading} alt="Loading.." />
          <span className="font-bold mt-10">Buscando...</span>
        </LoadingWrapper>
      )}
      {!isLoading && tickets.length && (
        <div className="relative overflow-x-auto overflow-y-scroll max-h-[300px] custom-scrollbar">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
              <tr>
                {heading.map((head, index) => (
                  <th key={index} scope="col" className="px-6 py-3 sticky">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const value = Number(parseFloat(ticket.purchaseValue!.replace(",", ".")).toFixed(2));
                const formattedValue = value.toLocaleString("pt-BR", {
                  currency: "BRL",
                  style: "currency",
                });

                return (
                  <tr
                    key={ticket.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                    >
                      <a href={`ticket-details/${ticket.id}`}>{ticket.name ?? "N/A"}</a>
                    </th>
                    <td className="px-6 py-4">{ticket.document ?? "N/A"}</td>
                    <td className="px-6 py-4">{formattedValue}</td>
                    <td className="px-6 py-4">
                      {ticket.filled ? "Sim" : "Não"}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.pending ? "Pendente" : "Gerada"}
                    </td>
                    {/* <td className="px-6 py-4">ações</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && !tickets.length && (
        <span>Nenhuma etiqueta encontrada.</span>
      )}
    </Wrapper>
  );
};
