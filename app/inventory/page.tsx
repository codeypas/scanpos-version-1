"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2, Edit, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Product {
  id: string
  name: string
  price: number
  gst: number
  stock: number
  minStock: number
  barcode: string
  category: string
}

export default function Inventory() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  // Form states
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productGst, setProductGst] = useState("")
  const [productStock, setProductStock] = useState("")
  const [productMinStock, setProductMinStock] = useState("")
  const [productCategory, setProductCategory] = useState("")

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        // Check localStorage first
        const storedProducts = localStorage.getItem("inventory-products")

        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts)
          setProducts(parsedProducts)
          setFilteredProducts(parsedProducts)
        } else {
          // This would be replaced with an actual API call
          const mockProducts: Product[] = [
            {
              id: "1",
              name: "Wireless Mouse",
              price: 1200,
              gst: 18,
              stock: 25,
              minStock: 10,
              barcode: "8901234567890",
              category: "Electronics",
            },
            {
              id: "2",
              name: "USB-C Cable",
              price: 450,
              gst: 18,
              stock: 5,
              minStock: 15,
              barcode: "8901234567891",
              category: "Electronics",
            },
            {
              id: "3",
              name: "Bluetooth Speaker",
              price: 2500,
              gst: 18,
              stock: 15,
              minStock: 5,
              barcode: "8901234567892",
              category: "Electronics",
            },
            {
              id: "4",
              name: "Laptop Bag",
              price: 1800,
              gst: 12,
              stock: 20,
              minStock: 8,
              barcode: "8901234567893",
              category: "Accessories",
            },
            {
              id: "5",
              name: "Wireless Keyboard",
              price: 1500,
              gst: 18,
              stock: 3,
              minStock: 10,
              barcode: "8901234567894",
              category: "Electronics",
            },
          ]
          setProducts(mockProducts)
          setFilteredProducts(mockProducts)
          // Save to localStorage
          localStorage.setItem("inventory-products", JSON.stringify(mockProducts))
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const handleAddProduct = async () => {
    // Validate form
    if (!productName || !productPrice || !productGst || !productStock || !productMinStock) {
      alert("Please fill in all required fields")
      return
    }

    // Generate a random barcode for demo purposes
    const barcode = Math.floor(Math.random() * 10000000000000)
      .toString()
      .padStart(13, "0")

    const newProduct: Product = {
      id: (products.length + 1).toString(),
      name: productName,
      price: Number.parseFloat(productPrice),
      gst: Number.parseFloat(productGst),
      stock: Number.parseInt(productStock),
      minStock: Number.parseInt(productMinStock),
      barcode,
      category: productCategory || "Uncategorized",
    }

    try {
      // In a real app, this would be an API call
      // For now, we'll just update the state directly
      setProducts([...products, newProduct])

      // Also update filtered products if no search is active
      if (!searchTerm) {
        setFilteredProducts([...filteredProducts, newProduct])
      }

      resetForm()
      setShowAddDialog(false)
    } catch (error) {
      console.error("Failed to add product:", error)
      alert("Failed to add product. Please try again.")
    }

    // Save to localStorage
    localStorage.setItem("inventory-products", JSON.stringify([...products, newProduct]))
  }

  const handleEditProduct = () => {
    if (!currentProduct) return

    // Validate form
    if (!productName || !productPrice || !productGst || !productStock || !productMinStock) {
      alert("Please fill in all required fields")
      return
    }

    const updatedProduct: Product = {
      ...currentProduct,
      name: productName,
      price: Number.parseFloat(productPrice),
      gst: Number.parseFloat(productGst),
      stock: Number.parseInt(productStock),
      minStock: Number.parseInt(productMinStock),
      category: productCategory || "Uncategorized",
    }

    const updatedProducts = products.map((p) => (p.id === currentProduct.id ? updatedProduct : p))

    setProducts(updatedProducts)
    setFilteredProducts(
      products.filter((product) => {
        if (searchTerm) {
          return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        return true
      }),
    )
    resetForm()
    setShowEditDialog(false)

    // Save to localStorage
    localStorage.setItem("inventory-products", JSON.stringify(updatedProducts))
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      setProducts(updatedProducts)
      setFilteredProducts(
        products
          .filter((product) => {
            if (searchTerm) {
              return (
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode.includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
            }
            return true
          })
          .filter((p) => p.id !== id),
      )
    }

    // Save to localStorage
    localStorage.setItem("inventory-products", JSON.stringify(updatedProducts))
  }

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product)
    setProductName(product.name)
    setProductPrice(product.price.toString())
    setProductGst(product.gst.toString())
    setProductStock(product.stock.toString())
    setProductMinStock(product.minStock.toString())
    setProductCategory(product.category)
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setProductName("")
    setProductPrice("")
    setProductGst("")
    setProductStock("")
    setProductMinStock("")
    setProductCategory("")
    setCurrentProduct(null)
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Inventory Management" text="Manage your products, stock levels, and pricing.">
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DashboardHeader>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, barcode, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.gst}%</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    {product.stock <= 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : product.stock <= product.minStock ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Wireless Mouse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="1200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input
                    id="gst"
                    type="number"
                    value={productGst}
                    onChange={(e) => setProductGst(e.target.value)}
                    placeholder="18"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={productMinStock}
                    onChange={(e) => setProductMinStock(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  placeholder="Electronics"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gst">GST (%)</Label>
                  <Input
                    id="edit-gst"
                    type="number"
                    value={productGst}
                    onChange={(e) => setProductGst(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Current Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-minStock">Minimum Stock</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={productMinStock}
                    onChange={(e) => setProductMinStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>Update Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </DashboardLayout>
  )
}

