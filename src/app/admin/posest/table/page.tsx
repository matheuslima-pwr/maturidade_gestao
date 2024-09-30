"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Download, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import api from "@/app/api"

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

export default function DataVisualizationPage() {
    const [data, setData] = useState<Data[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const [nameFilter, setNameFilter] = useState("")
    const [itemToDelete, setItemToDelete] = useState<{ id: string; nome: string } | null>(null)
    
    const filteredData = data.filter(item => 
        item.nome.toLowerCase().includes(nameFilter.toLowerCase())
    )

  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleExportCSV = () => {
    const headers = ["id", "nome", "email", "empresa", "segmento", "telefone", "faturamento", "operacional", "cliente", "produto"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => headers.map(header => row[header as keyof typeof row]).join(","))
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

  const handleDeleteItem = (id: string) => {
    setData(prevData => prevData.filter(item => item.id !== id))
    setItemToDelete(null)
  }

  return (
    <div className="container mx-auto py-8">      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full md:w-64 bg-[#f9f9f9] border border-gray-300 shadow-md"
        />
        <Button onClick={handleExportCSV} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export to CSV
        </Button>
      </div>

      <Card className="mb-6 max-h-[650px] overflow-scroll">
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Excelencia Operacional</TableHead>
                <TableHead>Intimidade com o Cliente</TableHead>
                <TableHead>Liderança em Produto</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.empresa}</TableCell>
                  <TableCell>{item.segmento}</TableCell>
                  <TableCell>{item.telefone}</TableCell>
                  <TableCell>{item.faturamento}</TableCell>
                  <TableCell>{item.operacional}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setItemToDelete(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the data for {itemToDelete?.nome || ''}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteItem(itemToDelete?.id ?? '')}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {currentPage} of {pageCount}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[180px] bg-[#171717] text-white">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
            <SelectItem value="500">500 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}