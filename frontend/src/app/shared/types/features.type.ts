import { UserDto } from '../../features/auth/dtos/user.interface.dto';
import { User } from '../../features/auth/interfaces/user.interface';
import { UserMapper } from '../../features/auth/mappers/user.mapper';
import { CategoryDto } from '../../features/categories/dtos/category.interface.dto';
import { Category } from '../../features/categories/interfaces/category.interface';
import { CategoryMapper } from '../../features/categories/mappers/category.mapper';
import { PriceGroupItemDto } from '../../features/price-groups/dtos/price-group-item.dto.interface';
import { PriceGroupDto } from '../../features/price-groups/dtos/price-group.dto.interface';
import { PriceGroupItem } from '../../features/price-groups/interfaces/price-group-item.interface';
import { PriceGroup } from '../../features/price-groups/interfaces/price-group.interface';
import { PriceGroupItemMapper } from '../../features/price-groups/mappers/price-group-item.mapper';
import { PriceGroupMapper } from '../../features/price-groups/mappers/price-groups.mapper';
import { ProductDto } from '../../features/products/dtos/product.interface.dto';
import { Product } from '../../features/products/interfaces/product.interface';
import { ProductMapper } from '../../features/products/mappers/product.mapper';
import { TransactionItemDto } from '../../features/transactions/dtos/transaction-item.interface.dto';
import { TransactionDto } from '../../features/transactions/dtos/transaction.dto';
import { TransactionItem } from '../../features/transactions/interfaces/transaction-item.interface';
import { Transaction } from '../../features/transactions/interfaces/transaction.interface';
import { TransactionItemMapper } from '../../features/transactions/mappers/transaction-item.mapper';
import { TransactionMapper } from '../../features/transactions/mappers/transaction.mapper';

export type Feature =
  | Product
  | User
  | Category
  | Transaction
  | TransactionItem
  | PriceGroup
  | PriceGroupItem;
export type FeatureDto =
  | ProductDto
  | UserDto
  | CategoryDto
  | TransactionDto
  | TransactionItemDto
  | PriceGroupDto
  | PriceGroupItemDto;
export type Mapper =
  | ProductMapper
  | UserMapper
  | CategoryMapper
  | TransactionMapper
  | TransactionItemMapper
  | PriceGroupMapper
  | PriceGroupItemMapper;
