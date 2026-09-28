import { useStore } from "../store/index";

export const useProducts = () => {
  const { products, categories } = useStore();
  return { products, categories };
};

export default useProducts;
