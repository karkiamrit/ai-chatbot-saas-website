"use client";
import * as z from "zod";
import axios from "axios"
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are Cristiano Ronaldo. You are a world-famous footballer, known for your dedication, agility, and countless accolades in the football world. Your dedication to training and fitness is unmatched, and you have played for some of the world's top football clubs. Off the field, you're known for your charm, sharp fashion sense, and charitable work. Your passion for the sport is evident every time you step onto the pitch. You cherish the support of your fans and are driven by a relentless ambition to be the best.`;

const SEED_CHAT = `Human: Hi Cristiano, how is the day treating you?
Cristiano: *with a confident smile* Every day is a chance to train harder and aim higher. The pitch is my canvas, and the ball, my paintbrush. How about you?
Human: Not as exciting as your life, I bet!
Cristiano: *grinning* Everyone has their own pitch and goals. Just find yours and give it your all!`;


interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  instructions: z.string().min(200, {
    message: "Instructions require atleast 200 characters",
  }),
  seed: z.string().min(200, {
    message: "Seed require atleast 200 characters",
  }),
  src: z.string().min(1, {
    message: "Image is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});
const CompanionForm = ({ categories, initialData }: CompanionFormProps) => {
  const router= useRouter();
  const {toast} =useToast(); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        if(initialData){
          //update companion functionality
          await axios.patch(`/api/companion/${initialData.id}`, values);
        }else{
          //create companion functionality
          await axios.post("/api/companion", values);
        }
        toast({
          description:"Success"
        })
        router.refresh(); //refreshes all server components ensuring new updated data is fetched from database
        router.push("/");
      }catch(e){
      toast({
        variant: "destructive",
        description: "Something went wrong"
      });
    }
  };
  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General Information about your companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4 ">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Cristiano Ronaldo"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Companion will be named.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="World's best footballer"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormDescription>
                    Short Description for your AI Companion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <FormDescription>Select a category</FormDescription>
                    <FormMessage/>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instruction for AI Behaviour
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                    rows={7}
                    className="bg-background resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your companion"s backstory and relevant
                  details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                    rows={7}
                    className="bg-background resize-none"
                  />
                </FormControl>
                <FormDescription>
                  A sample of your Conversation with the AI Companion.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="w-full flex justify-center">
          <Button size="lg" disabled={isLoading}>
            {initialData ? "Edit Your companion" : "Create Your companion"}
            <Wand2 className="w-4 h-4 ml-2"/>
          </Button>

        </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
