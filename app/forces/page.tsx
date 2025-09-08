import { getTranslations } from "next-intl/server";
import {
  SearchPagination,
  SearchPaginationSearchParams,
} from "@/components/common/search-pagination";
import axios from "axios";
import DataTable from "@/components/common/data-table";

export interface UnitsResponse {
  units: Unit[];
}

export interface Unit {
  id: number;
  name: string;
  coordinate: Coordinate;
  address: Address;
  commanderTokenId: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Address {
  post_code: number;
  country: string;
  state: string;
  locality: string;
  street: string;
  house_number: string;
}

export type MilitaryUnitSearchParams = SearchPaginationSearchParams & {
  keyword?: string;
  type?: string;
  tab?: string; // Добавлен параметр для вкладок
};

export default async function MilitaryUnitsPage({
  searchParams,
}: {
  searchParams: Promise<MilitaryUnitSearchParams>;
}) {
  const t = await getTranslations("Page.MilitaryUnitsPage");

  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;
  const tab = params.tab || "units"; // Значение по умолчанию - "units"

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/units`);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch military units: ${response.statusText}`);
  }

  const units: UnitsResponse = response.data;
  console.log(units);
  console.log(response);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Coordinates", accessor: "coordinate.latitude" },
    { header: "Address", accessor: "address.street" },
    { header: "Commander", accessor: "commanderTokenId" },
    { header: "Created At", accessor: "createdAt" },
    { header: "Updated At", accessor: "updatedAt" },
  ];

  // Определение активной вкладки для стилизации
  const tabs = [
    { key: "units", label: t("units") }, // Воинские части
    { key: "sections", label: t("sections") }, // Отделения
    { key: "platoons", label: t("platoons") }, // Взводы
    { key: "companies", label: t("companies") }, // Роты
    { key: "brigades", label: t("brigades") }, // Бригады
    { key: "corps", label: t("corps") }, // Корпусы
    { key: "divisions", label: t("divisions") }, // Дивизии
    { key: "armies", label: t("armies") }, // Армии
  ];

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 border-b border-border">
        {tabs.map((tabItem) => (
          <a
            key={tabItem.key}
            href={`?tab=${tabItem.key}`}
            className={`px-4 py-2 text-sm font-medium uppercase ${
              tab === tabItem.key
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabItem.label}
          </a>
        ))}
      </div>
      <h1 className="font-bold mb-6">{t("militaryUnitsTitle")}</h1>
      <div>
        <p>{t("searchPlaceholder")}</p>
      </div>
      {1 === 0 ? (
        <div className="text-center text-gray-600 py-6">
          {/* Placeholder для пустого состояния */}
        </div>
      ) : (
        <>
          <DataTable data={units} columns={columns} />
          <SearchPagination currentPage={page} pagesTotal={10} />
        </>
      )}
    </div>
  );
}
