import { getCartAction } from "@/actions/cart";
import CartPage from "@/components/cart/CartPage";

export default async function CartRoutePage() {
  const { cart, error } = await getCartAction();
  return <CartPage cart={cart} error={error} />;
}
