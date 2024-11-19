import { z } from "zod";

// Schema options that can be modified as needed
export const schemaOptions = {
  minTitle: 8,
  minDescription: 20,
  minPrice: 1,
  minContent: 20,
  minAuthor: 3,
  minCategory: 3,
  minWidth: 600,
  minHeight: 800,
  maxWidth: 1920,
  maxHeight: 1080,
  maxFileSize: 1024 * 1024 * 3, // 4MB
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
};
const { minWidth, minHeight, maxWidth, maxHeight } = schemaOptions;
// Form schema using schemaOptions for configurable values
 const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(12, "Description is required").max(255, "Description is too long"),
  content: z.string().min(1, "Content is required").optional(),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  image: z
    .instanceof(File)
    .refine((file) => schemaOptions.allowedFileTypes.includes(file.type), {
      message: "Only PNG, JPEG, or JPG images are allowed",
    })
    .refine((file) => file.size <= schemaOptions.maxFileSize, {
      message: `File must be less than ${
        schemaOptions.maxFileSize / (1024 * 1024)
      }MB`,
    })
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= minWidth &&
                img.height >= minHeight &&
                img.width <= maxWidth &&
                img.height <= maxHeight;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`,
      }
    ),
});

export type BookSchemaValues = z.infer<typeof BookSchema>;
export default BookSchema