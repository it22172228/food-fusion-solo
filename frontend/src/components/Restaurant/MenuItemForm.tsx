import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const menuItemSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  onSubmit: (data: MenuItemFormValues) => void;
  initialData?: MenuItemFormValues;
  onCancel: () => void;
}

const defaultValues: MenuItemFormValues = {
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
};

const foodCategories = [
  'Asian Fusion',
  'Italian',
  'Mexican',
  'Desserts',
  'Vegetarian',
  'Korean-Mexican',
  'Burgers',
  'Pizza',
  'Mediterranean',
  'Indian',
  'Thai',
  'Chinese',
  'Japanese',
  'Seafood',
];

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const { toast } = useToast();
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || defaultValues,
  });

  // For image preview
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    form.setValue('image', url);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Spicy Tuna Roll" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your dish..." 
                          className="resize-none min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="14.99" 
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {foodCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          onChange={handleImageChange}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for your dish image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border rounded-md overflow-hidden h-[200px] mt-2">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Menu item preview" 
                      className="object-cover w-full h-full" 
                      onError={() => {
                        setImagePreview('');
                        toast({
                          title: "Image Error",
                          description: "The image URL is invalid or inaccessible.",
                          variant: "destructive"
                        });
                      }}
                    />
                  ) : (
                    <div className="bg-muted h-full flex items-center justify-center text-muted-foreground">
                      Image Preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end gap-2 px-0">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Item' : 'Add Item'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MenuItemForm;
