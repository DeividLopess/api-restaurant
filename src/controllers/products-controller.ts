import { NextFunction, Request, Response } from "express";
import { knex } from "../database/knex";
import { AppError } from "../utils/AppError";
import { z } from "zod";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      const products = await knex<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

      return res.json({ products });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0, { message: "Price must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(req.body);
      await knex<ProductRepository>("products").insert({ name, price });

      return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), { message: "Invalid product ID" })
        .parse(req.params.id);

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0, { message: "Price must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(req.body);
      await knex<ProductRepository>("products")
        .where("id", id)
        .update({ name, price, updated_at: knex.fn.now() });

      return res.json({ message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), {
          message: "ID must be a valid number",
        })
        .parse(req.params.id);

      const product = await knex<ProductRepository>("products")
        .where("id", id)
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<ProductRepository>("products").where("id", id).delete();

      return res.json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
