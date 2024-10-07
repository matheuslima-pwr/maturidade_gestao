"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Download, Trash, Trash2Icon, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import api from "@/app/api"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

type Data = {
  id: string
  nome: string
  email: string
  empresa: string
  segmento: string
  telefone: string
  faturamento: string
  operacional: string
  cliente: string
  produto: string
}

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => <div className="text-left font-medium lowercase">{row.getValue("email")}</div>
  },
  {
    accessorKey: "empresa",
    header: () => <div className="text-left">Empresa</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("empresa")}</div>
  },
  {
    accessorKey: "segmento",
    header: () => <div className="text-left">Segmento</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("segmento")}</div>
  },
  {
    accessorKey: "telefone",
    header: () => <div className="text-left">Telefone</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("telefone")}</div>
  },
  {
    accessorKey: "faturamento",
    header: () => <div className="text-left">Faturamento</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("faturamento")}</div>
  },
  {
    accessorKey: "operacional",
    header: () => <div className="text-left">Excelência Operacional</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("operacional")}</div>
  },
  {
    accessorKey: "cliente",
    header: () => <div className="text-left">Intimidade com o Cliente</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("cliente")}</div>
  },
  {
    accessorKey: "produto",
    header: () => <div className="text-left">Liderança em Produto</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("produto")}</div>
  },
]

export default function DataVisualizationPage() {
  const [data, setData] = useState<Data[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const router = useRouter()

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/posest/users")
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const deleteSelectedRows = () => {
    const selectedRowIds = table.getSelectedRowModel().rows.map(row => row.original.id)
    // Filtrar as linhas que não foram selecionadas
    const newData = data.filter(row => !selectedRowIds.includes(row.id))
    setData(newData)
    // Limpar a seleção após deletar
    setRowSelection({})
  }

  const exportCSV = () => {
    const headers = ["id", "nome", "email", "empresa", "segmento", "telefone", "faturamento", "operacional", "cliente", "produto"]
    const csvContent = [
      headers.join(","),
      ...selectedRows.map(row => headers.map(header => row[header as keyof typeof row]).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "leads_data.csv")
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleExportCSV = () => {
    if(selectedRows.length === 0) {
      Swal.fire({
        title: 'Nenhum dado selecionado',
        text: 'Por favor, selecione os dados que deseja exportar',
        icon: 'warning'
      })
      return
    }

    Swal.fire({
      title: 'Exportar dados',
      text: 'Deseja exportar os dados para um arquivo CSV?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        exportCSV()
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button onClick={() => router.push('/admin/forms')} className="flex items-center w-min gap-2 bg-[#004477] text-white">
          <Undo2 size={20} />
          Voltar para seleção
        </Button>

        <Input
          placeholder="Filter names..."
          value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nome")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white border border-[#a3a3a3]"
        />
        <Button onClick={handleExportCSV} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export to CSV
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="ml-auto mr-2 w-full md:w-auto bg-destructive hover:bg-destructive/90 disabled:bg-[#a3a3a3]" disabled>
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete selected rows
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected rows from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-destructive" onClick={deleteSelectedRows}><Trash2Icon className="mr-2 h-4 w-4" /> Delete</AlertDialogAction>
              <AlertDialogCancel className="bg-[#004477] text-white hover:bg-[#004477]/90 hover:text-white"><Undo2 className="mr-2 h-4 w-4" /> Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white border border-[#a3a3a3]">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="mb-6 max-h-[650px] overflow-y-auto">
        <CardHeader>
          <CardTitle>Posicionamento Estratégico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}</span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select
          defaultValue="100"
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger className="w-[180px] bg-[#171717] text-white">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100 per page</SelectItem>
            <SelectItem value="500">500 per page</SelectItem>
            <SelectItem value="1000">1000 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}