"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  Switch,
  Navbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  RefreshIcon,
  DocumentRemoveIcon,
} from "@heroicons/react/outline";
import { fetchAllVoucher } from "@/app/controller/auth/auth";
import { useUserContext } from "@/contexts/users/userUser";
import { User } from "@/contexts/types";
import { AcademicCapIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/outline";
import { NoEncryption, TimeToLeave } from "@mui/icons-material";
import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";
import { ChipIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAdminContext } from "@/contexts/users/useAdmin";

interface Fee {
  id: string;
  name: string;
  amount: number;
  used: string;
}

interface Voucher {
  id: string;
  semester: "1st" | "2nd";
  actions?: string;
  voucher_name: string;
  start_date: string;
  end_date: string;
  fees: Fee[];
  creator: User;
  encrypt_voucher: boolean;
  // password: string;
  total_amount: number;
  status: boolean;
  isPayingForAnother: User | null;
  values: string[];
}

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "voucher_name",
  "start_date",
  "end_date",
  "semester",
  "created_for",
  "total_amount",
  "status",
  "externalUserId",
];

function Page() {
  const [userId, setUserId] = useState<Voucher[]>([]);
  const [sampleVouchers, setSampleVouchers] = useState<Voucher[]>([]);
  const { admin: user } = useContext(useAdminContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>("all");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [time, setTime] = useState<number>(0);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("change time ");
      setTime((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    const toast_id = toast.loading("fetching voucher...");
    setLoading(true);
    (async () => {
      const res = await fetchAllVoucher();
      if (res === 500) {
        const errorMessage = `Unable to fetch vouchers}.`;
        toast.dismiss(toast_id);
        toast.error(errorMessage, {
          autoClose: 50000,
        });
      } else if (res.ok) {
        const data = await res.json();
        setSampleVouchers(data);
        setLoading(false);
        const errorMessage = `Vouchers fetched successfully}.`;
        toast.dismiss(toast_id);
        toast.success(errorMessage, {
          autoClose: 5000,
        });
      }
    })();
  }, [userId]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") {
      const dample =
        sampleVouchers.length > 0
          ? Object?.keys(sampleVouchers?.[0])?.map((key) => ({
              uid: key,
              name: key,
              sortable: true,
            }))
          : INITIAL_VISIBLE_COLUMNS?.map((key) => ({
              uid: key,
              name: key,
              sortable: true,
            }));
      dample.push({ uid: "actions", name: "actions", sortable: true });
      return dample;
    }
    const dample =
      sampleVouchers.length > 0
        ? Object.keys(sampleVouchers[0])
            .filter((key) => Array.from(visibleColumns).includes(key))
            .map((key) => ({ uid: key, name: key, sortable: true }))
        : [];
    dample.push({ uid: "action", name: "action", sortable: true });
    return dample;
  }, [visibleColumns, sampleVouchers]);

  const headerColumns2 = useMemo(() => {
    return sampleVouchers.length > 0
      ? Object.keys(sampleVouchers[0])?.map((key) => ({
          uid: key,
          name: key,
          sortable: true,
        }))
      : [];
  }, [visibleColumns, sampleVouchers]);

  const filteredItems = useMemo(() => {
    let filteredVouchers = [...sampleVouchers];

    if (hasSearchFilter) {
      filteredVouchers = filteredVouchers?.filter((voucher) =>
        voucher?.voucher_name.toLowerCase().includes(filterValue?.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredVouchers = filteredVouchers?.filter((voucher) =>
        Array.from(statusFilter).includes(
          voucher?.fees?.every((e) => e?.used) + ""
        )
      );
    }

    return filteredVouchers;
  }, [filterValue, statusFilter, sampleVouchers, time]);

  const pages = Math.ceil(filteredItems?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Voucher, b: Voucher) => {
      const first = a[sortDescriptor?.column as keyof Voucher] as
        | string
        | number;
      const second = b[sortDescriptor?.column as keyof Voucher] as
        | string
        | number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, time]);

  const renderCell = useCallback(
    (voucher: Voucher, columnKey: React.Key) => {
      let cellValue = voucher[columnKey as keyof Voucher];
      switch (columnKey) {
        case "created_for":
          <h1 className="text-secondary-500 dark:text-default-500">
            {" "}
            return voucher.isPayingForAnother ?
            voucher.isPayingForAnother.matric_number :
            voucher.creator.matric_number;
          </h1>;

        case "password":
          "Not applicable";
        case "creator":
          return (voucher.creator?.id as any) == (user?.id as any)
            ? "You"
            : voucher.creator?.matric_number;
        case "voucher_name":
          return cellValue;
        case "start_date":
        case "end_date":
          return cellValue;
        case "total_amount":
          return cellValue;
        case "fees":
          return (
            <div className="relative flex items-center w-full ">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="w-full gap-2 text-sm "
                    size="sm"
                    variant="light"
                  >
                    <Chip
                      className="p-3 capitalize"
                      color={"success"}
                      size="sm"
                      variant="flat"
                    >
                      Check invoice
                    </Chip>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Usage Analytics</th>
                          </tr>
                        </thead>
                        <tbody>
                          {voucher?.fees.map((fee: Fee) => {
                            return (
                              <tr key={voucher.id}>
                                <td className="px-4 py-2 border">
                                  {" "}
                                  {
                                    <Chip
                                      className="capitalize"
                                      color={`${fee.used == "true" ? "success" : "danger"}`}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {fee.id}
                                    </Chip>
                                  }
                                </td>
                                <td className="px-4 py-2 border">
                                  {" "}
                                  {
                                    <Chip
                                      className="capitalize"
                                      color={`${fee.used == "true" ? "success" : "danger"}`}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {fee.name}
                                    </Chip>
                                  }
                                </td>
                                <td className="px-4 py-2 border">
                                  {" "}
                                  {
                                    <Chip
                                      className="capitalize"
                                      color={`${fee.used == "true" ? "success" : "danger"}`}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {fee.amount}
                                    </Chip>
                                  }
                                </td>
                                <td className="px-4 py-2 border">
                                  {
                                    <Chip
                                      className="capitalize"
                                      color={`${fee.used == "true" ? "success" : "danger"}`}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {fee.used ? "Used" : "Not use yet"}
                                    </Chip>
                                  }
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "encrypt_voucher":
          return (
            <div className="flex items-center justify-center w-full mx-auto text-center">
              <DotsCircleHorizontalIcon className="w-5 h-5 mx-auto text-center text-blue-500 " />
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={`${cellValue == "true" ? "success" : "danger"}`}
              size="sm"
              variant="flat"
            >
              {cellValue as any}
            </Chip>
          );
        case "externalUserId":
          return voucher.isPayingForAnother
            ? `External User ID: ${cellValue}`
            : "N/A";
        case "actions":
          return (
            <div className="relative flex items-center justify-start gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <DotsVerticalIcon className="w-4 h-4 text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    startContent={
                      <EyeIcon className="w-4 h-4 text-secondary" />
                    }
                  >
                    <a href={`/dashboard/voucher/view/${voucher.id}`}>View</a>
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <RefreshIcon className="w-4 h-4 text-secondary" />
                    }
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <DocumentRemoveIcon className="w-4 h-4 text-secondary" />
                    }
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "timestamp":
          return (
            <div className="flex items-center justify-center w-full mx-auto space-x-3 text-center">
              {/* <TimeToLeave className="w-5 h-5 mx-auto text-center text-blue-500 " /> */}
              <div>
                <ChipIcon className="w-8 h-8 text-purple-300 animate-spin" />
              </div>
              <Chip color="secondary" size="sm" className="txt-[10px]">
                {formatDistanceToNow(parseISO(cellValue as any), {
                  addSuffix: false,
                })
                  .replace("less than a", "")
                  .replace("about", "")
                  .replace("minutes", "min")
                  .replace("hours", "hrs") + " ago"}
              </Chip>
            </div>
          );

        case "values":
          if (!(cellValue instanceof Array)) {
            cellValue = (cellValue as string)
              .replace("[", "")
              .replace("]", "")
              .split(",");
            // throw cellValue;
          }
          return (
            <div className="relative flex items-center justify-start gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <DotsVerticalIcon className="w-4 h-4 text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {(console.log(typeof cellValue), cellValue as string[])?.map(
                    (payment) => {
                      return (
                        <DropdownItem
                          className="text-primary"
                          startContent={
                            <AcademicCapIcon className="w-3 h-3 text-secondary" />
                          }
                        >
                          {payment.replaceAll("'", "")}
                        </DropdownItem>
                      );
                    }
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "semester":
          return (
            <div className="flex items-center justify-center w-full mx-auto space-x-3 text-center">
              {/* <TimeToLeave className="w-5 h-5 mx-auto text-center text-blue-500 " /> */}
              <div>
                <ChipIcon className="w-8 h-8 text-purple-300 animate-spin" />
              </div>
              <Chip color="secondary" size="sm" className="txt-[10px]">
                {cellValue as string}
              </Chip>
            </div>
          );
        default:
          return cellValue instanceof Object ? columnKey : cellValue;
      }
    },
    [time]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [time]
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon className={"w-7 h-7"} />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <ChevronDownIcon className="text-default-300 text-small" />
                  }
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {["unused", "used", "expired", "archived"].map((status) => (
                  <DropdownItem key={status} className="capitalize">
                    {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {headerColumns2.map((column) => (
                  <DropdownItem
                    color="secondary"
                    key={column.uid}
                    className="capitalize"
                  >
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon className="w-3 h-4 text-default-300" />}
            >
              <a href="/dashboard/voucher/new">Add New</a>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {sampleVouchers.length} vouchers
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    time,
    onSearchChange,
    onRowsPerPageChange,
    sampleVouchers.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages]);

  return (
    <>
      <Navbar isBordered className="mb-6 dark:bg-slate-900">
        <NavbarContent>
          <NavbarBrand className="dark:bg-slate-900">
            <div color="inherit">Voucher Management</div>
          </NavbarBrand>
          <Switch
            checked={isDark}
            onChange={(e) => setIsDark(e.target.checked)}
          />
        </NavbarContent>
      </Navbar>
      <main>
        <Table
          color="secondary"
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[382px] dark:bg-slate-900",
            thead: "dark:bg-slate-900",
            th: "dark:bg-slate-900",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns} className="dark:bg-slate-800">
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No vouchers found"}
            items={sampleVouchers.length == 0 ? [] : sortedItems.toReversed()}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as string) as string}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </>
  );
}

export default Page;
