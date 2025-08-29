import React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import useAddFine from "@/hooks/api/fine/fine-add-fine"
import useGetUserById from "@/hooks/api/user/use-get-user-by-id"
import useGetBooks from "@/hooks/api/book/use-get-books"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface Book {
  _id: string;
  title: string;
  author: string;
}


const formSchema = z.object({
  user_id: z.string().min(1, "Vui lòng chọn hội viên"),
  book_id: z.string().min(1, "Vui lòng chọn sách"),
  amount: z.number().min(1, "Vui lòng nhập số tiền phạt"),
  reason: z.string().min(1, "Vui lòng nhập lý do phạt"),
  is_paid: z.boolean().default(false),
})

const AddFine = () => {
  const router = useRouter()
  const { addFine, loading } = useAddFine()
  const userId = (router.query.userId as string) || ""
  const { data: userDetail } = useGetUserById(userId)
  const { data: allBooks } = useGetBooks()  
  console.log("allBooks  ",allBooks)
  const [bookPopoverOpen, setBookPopoverOpen] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userId,
      book_id: "",
      amount: 0,
      reason: "",
      is_paid: false,
    },
  })

  // Build books list from not-returned borrow records of this use

  // Ensure user_id stays in sync if query changes
  React.useEffect(() => {
    if (userId) {
      form.setValue("user_id", userId)
    }
  }, [userId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const submitData = {
        ...values,
        book_id: values.book_id,
        user_id: values.user_id,
        amount: parseInt(values.amount.toString()),
        is_paid: values.is_paid || false,
      }
      await addFine({ data: submitData })
      showSuccessToast("Thêm phạt thành công!")
      router.push("/fine")
    } catch {
      showErrorToast("Thêm phạt thất bại!")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto py-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Thêm phạt</h2>
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hội viên</FormLabel>
              <FormControl>
                <>
                  <Input placeholder="Nhập hội viên" value={userDetail?.full_name || ""} disabled />
                  <input type="hidden" {...field} value={userId} />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="book_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sách</FormLabel>
              <FormControl>
                <Popover open={bookPopoverOpen} onOpenChange={setBookPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-between">
                      {allBooks?.find((b: any) => b._id === field.value)?.title || "Chọn sách"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput placeholder="Tìm sách..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy sách.</CommandEmpty>
                        <CommandGroup>
                          {(allBooks || []).map((book: any) => (
                            <CommandItem
                              key={book._id}
                              value={`${book.title} ${book.author}`}
                              onSelect={() => {
                                field.onChange(book._id)
                                setBookPopoverOpen(false)
                              }}
                            >
                              {book.title} - {book.author}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền phạt</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số tiền phạt"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do phạt</FormLabel>
              <FormControl>
                <Input placeholder="Nhập lý do phạt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading
              ? "Đang lưu..."
              : "Thêm phạt"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/fine")}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddFine
