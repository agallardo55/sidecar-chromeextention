
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Mail, Phone } from 'lucide-react';

const buyerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

interface Buyer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface BuyerEditModalProps {
  buyer?: Buyer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (buyer: Buyer) => void;
  mode: 'add' | 'edit';
}

export const BuyerEditModal = ({ buyer, isOpen, onClose, onSave, mode }: BuyerEditModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      name: buyer?.name || '',
      company: buyer?.company || '',
      email: buyer?.email || '',
      phone: buyer?.phone || '',
    },
  });

  // Reset form when buyer changes or mode changes
  React.useEffect(() => {
    if (mode === 'edit' && buyer) {
      form.reset({
        name: buyer.name,
        company: buyer.company,
        email: buyer.email,
        phone: buyer.phone,
      });
    } else if (mode === 'add') {
      form.reset({
        name: '',
        company: '',
        email: '',
        phone: '',
      });
    }
  }, [buyer, mode, form]);

  const onSubmit = async (data: BuyerFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let resultBuyer: Buyer;
      
      if (mode === 'add') {
        // Generate a new ID for the new buyer
        resultBuyer = {
          id: Date.now().toString(),
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
        };
      } else {
        // Update existing buyer
        resultBuyer = {
          ...buyer!,
          ...data,
        };
      }
      
      onSave(resultBuyer);
      toast({
        title: "Success",
        description: mode === 'add' ? "Buyer added successfully" : "Buyer information updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: mode === 'add' ? "Failed to add buyer" : "Failed to update buyer information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80%] max-h-[80vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="text-xl font-semibold">
            {mode === 'add' ? 'Add New Buyer' : 'Edit Buyer Information'}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Dealership/Company
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile Phone
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background border-t mt-6 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? (mode === 'add' ? 'Adding...' : 'Saving...') 
                    : (mode === 'add' ? 'Add Buyer' : 'Save Changes')
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
