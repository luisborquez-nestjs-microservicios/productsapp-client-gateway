import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const createdProduct = await firstValueFrom(
        this.client.send({ cmd: 'create_product' }, createProductDto)
      );

      return createdProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    // Manejo de excepciones en Observables - 1
    /*     
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id: id })
      );

      return product;
    } catch (error) {
      throw new RpcException(error);
    }
    */

    // Manejo de excepciones en Observables - 2
    return this.client.send({ cmd: 'find_one_product' }, { id: id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      );
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedProduct = await firstValueFrom(
        this.client.send({ cmd: 'delete_product' }, { id: id })
      );

      return deletedProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const updatedProduct = await firstValueFrom(
        this.client.send({ cmd: 'update_product' }, { ...updateProductDto, id })
      );

      return updatedProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
