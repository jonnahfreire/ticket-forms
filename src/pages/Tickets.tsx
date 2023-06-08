import { useEffect, useState } from "react";
import { DataProps, getTickets, updateTicket } from "../services/TicketService";
import { FormItemWrapper, LoadingWrapper, Wrapper } from "./ClientForm";

import tw from "tailwind-styled-components";

import Loading from "../assets/loading.gif";

import "../components/utils/custom-scrollbar.css";

export const ActionButton = tw.button`
  text-[10px] 
  shadow-md 
  rounded-xl 
  px-2 py-2 
  ml-2 
  hover:bg-gray-400 
  hover:transition 
  hover:text-gray-200 
  bg-gray-300 
  text-gray-600
`;

interface SelectedDataProps {
  selected: boolean;
  ticket: DataProps;
}

export const Tickets = () => {
  const [tickets, setTickets] = useState<SelectedDataProps[]>([]);

  const [filter, setFilter] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAllRowsChecked, setAllRowsChecked] = useState<boolean>(false);

  const heading = [
    "Nome",
    "Documento",
    "Valor",
    "Peso",
    "Transportadora",
    "Cliente Enviou",
    "Status",
    // "Ações",
  ];

  const filterBy = async (filter: string = "all") =>
    await getAllTickets(filter);

  async function getAllTickets(filter: string = "pending") {
    const response = await getTickets();

    const data: SelectedDataProps[] = response.map((ticket) => ({
      selected: false,
      ticket,
    }));

    filter === "all" && setTickets(data);
    filter === "pending" && setTickets(data.filter((t) => t.ticket?.pending == true));
    filter === "created" && setTickets(data.filter((t) => t.ticket?.pending == false));

    setIsLoading(false);
    setFilter(filter);
  }

  async function handleSetTicketCreated(pending: boolean = false) {
    if (tickets.some((data) => data.selected)) {
      const data = tickets.map((data) => {
        if (data.selected) {
          updateTicket(data.ticket.id!, { pending });
          data.ticket.pending = pending;
          data.selected = false;
        }

        return data;
      });
      setTickets(data);
      setAllRowsChecked(false);
    }
  }

  function handleSelectAllTickets() {
    const data = tickets.map((data) => {
      data.selected = !data.selected;
      return data;
    });

    setTickets(data);
    setAllRowsChecked(!isAllRowsChecked);
  }

  function handleSelectTicket(ticket: DataProps) {
    const data = tickets.map((data) => {
      if (data.ticket.id === ticket.id) {
        data.selected = !data.selected;
      }

      return data;
    });

    setTickets(data);
  }

  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <Wrapper className="align-start justify-start">
      {isLoading && (
        <LoadingWrapper>
          <img src={Loading} alt="Loading.." />
          <span className="font-bold mt-10">Buscando...</span>
        </LoadingWrapper>
      )}
      {!isLoading && tickets.length && (
        <div className="w-100">
          <div
            className="actions-container mt-5 mb-2 px-1 w-100"
            style={{
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormItemWrapper className="sm:flex-row items-center justify-center border p-2 rounded">
              <label className="mr-3">Filtros: </label>
              <FormItemWrapper className="sm:flex-row items-center justify-center mr-5 cursor-pointer">
                <label className="cursor-pointer font-semibold" htmlFor="all">
                  Todas
                </label>
                <input
                  id="all"
                  type="radio"
                  className="ml-2 cursor-pointer"
                  name="filter-selector"
                  onChange={() => filterBy("all")}
                  checked={filter == "all"}
                />
              </FormItemWrapper>
              <FormItemWrapper className="sm:flex-row items-center justify-center mr-5 cursor-pointer">
                <label
                  className="cursor-pointer font-semibold"
                  htmlFor="created"
                >
                  Geradas
                </label>
                <input
                  id="created"
                  type="radio"
                  className="ml-2 cursor-pointer"
                  name="filter-selector"
                  onChange={() => filterBy("created")}
                  checked={filter == "created"}
                />
              </FormItemWrapper>
              <FormItemWrapper className="sm:flex-row items-center justify-center cursor-pointer">
                <label
                  className="cursor-pointer font-semibold"
                  htmlFor="pending"
                >
                  Pendentes
                </label>
                <input
                  id="pending"
                  type="radio"
                  className="ml-2 cursor-pointer"
                  name="filter-selector"
                  onChange={() => filterBy("pending")}
                  checked={filter == "pending"}
                />
              </FormItemWrapper>
            </FormItemWrapper>
            <FormItemWrapper className="sm:flex-row">
              <ActionButton onClick={() => handleSetTicketCreated()}>
                Marcar como {isAllRowsChecked ? "geradas" : "gerada"}
              </ActionButton>
              <ActionButton onClick={() => handleSetTicketCreated(true)}>
                Marcar como {isAllRowsChecked ? "pendentes" : "pendente"}
              </ActionButton>
            </FormItemWrapper>
          </div>
          <div className="relative overflow-x-auto overflow-y-scroll max-h-[400px] custom-scrollbar mt-5">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th className="pl-5 outline-none">
                    <input
                      type="checkbox"
                      name="check-all-ticket"
                      id="row-massive-select"
                      onChange={handleSelectAllTickets}
                      checked={isAllRowsChecked}
                    />
                  </th>
                  {heading.map((head, index) => (
                    <th key={index} scope="col" className="px-6 py-3 sticky">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((data) => {
                  const value = Number(
                    parseFloat(
                      data.ticket.purchaseValue!.replace(",", ".")
                    ).toFixed(2)
                  );
                  const formattedValue = value.toLocaleString("pt-BR", {
                    currency: "BRL",
                    style: "currency",
                  });

                  return (
                    <tr
                      key={data.ticket.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th className="pl-5">
                        <input
                          type="checkbox"
                          name="check-ticket"
                          onChange={() => handleSelectTicket(data.ticket)}
                          checked={data.selected}
                          id={`row-${data.ticket.id}`}
                        />
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                      >
                        <a href={`ticket-details/${data.ticket.id}`}>
                          {data.ticket.name ?? "N/A"}
                        </a>
                      </th>
                      <td className="px-6 py-4">
                        {data.ticket.document ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">{formattedValue}</td>
                      <td className="px-6 py-4">{data.ticket.weight}</td>
                      <td className="px-6 py-4 text-center">
                        {data.ticket.shipping ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {data.ticket.filled ? "Sim" : "Não"}
                      </td>
                      <td className="px-6 py-4">
                        {data.ticket.pending ? "Pendente" : "Gerada"}
                      </td>
                      {/* <td>
                    <i className="fa-solid fa-trash" />
                    </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!isLoading && !tickets.length && (
        <div className="no-tickets-message">
          <span>Nenhuma etiqueta encontrada.</span>
        </div>
      )}
    </Wrapper>
  );
};
