<?php

namespace App\Enums;

enum ActionType: string
{
    case PRODUCT_CREATED = 'product_created';
    case PRODUCT_UPDATED = 'product_updated';
    case PRODUCT_DELETED = 'product_deleted';
    case PRODUCT_TOGGLED = 'product_toggled';
    case STOCK_ADDED = 'stock_added';
    case STOCK_REMOVED = 'stock_removed';
    case FAVOURITED = 'favourited';
    case UNFAVOURITED = 'unfavourited';


    case USER_LOGIN = 'user_login';
    case USER_LOGOUT = 'user_logout';
    case USER_CREATED = 'user_create';
    case USER_UPDATED = 'user_updated';
    case PASSWORD_CHANGED = 'password_changed';
    case USER_ASSIGNED_TO_GROUP = 'user_assigned_to_group';
    case USER_REMOVED_FROM_GROUP = 'user_removed_from_group';


    case PRICE_GROUP_ITEM_DELETED = 'price_group_item_deleted';
    case PRICE_GROUP_ITEM_UPDATED = 'price_group_item_updated';
    case PRICE_GROUP_DELETED = 'price_group_deleted';
    case PRICE_GROUP_UPDATED = 'price_group_updated';
    case PRICE_GROUP_CREATED = 'price_group_created';
    case CART_ITEM_ADDED = 'cart_item_added';
    case CART_ITEM_REMOVED = 'cart_item_removed';
    case TRANSACTION_CREATED = 'transaction_created';
    case TRANSACTION_STATUS_CHANGED = 'transaction_status_changed';

    case REGISTRATION_APPROVED = 'registration_approved';
    case REGISTRATION_REJECTED = 'registration_rejected';

    public function label(): string
    {
        return match($this) {
            self::PRODUCT_CREATED => 'Producto creado',
            self::PRODUCT_UPDATED => 'Producto actualizado',
            self::PRODUCT_DELETED => 'Producto eliminado',
            self::PRODUCT_TOGGLED => 'Producto activado/desactivado',
            self::STOCK_ADDED => 'Stock añadido',
            self::STOCK_REMOVED => 'Stock retirado',
            self::FAVOURITED => 'Añadido a favoritos',
            self::UNFAVOURITED => 'Quitado de favoritos',
            self::USER_LOGIN => 'Inicio de sesión',
            self::USER_LOGOUT => 'Cierre de sesión',
            self::USER_UPDATED => 'Usuario actualizado',
            self::USER_CREATED => 'Usuario creado',
            self::PASSWORD_CHANGED => 'Contraseña cambiada',
            self::CART_ITEM_ADDED => 'Producto añadido al carrito',
            self::CART_ITEM_REMOVED => 'Producto quitado del carrito',
            self::TRANSACTION_CREATED => 'Transacción creada',
            self::TRANSACTION_STATUS_CHANGED => 'Estado de transacción cambiado',
            self::REGISTRATION_APPROVED => 'Solicitud de registro aprobada',
            self::REGISTRATION_REJECTED => 'Solicitud de registro rechazada',
        };
    }
}
