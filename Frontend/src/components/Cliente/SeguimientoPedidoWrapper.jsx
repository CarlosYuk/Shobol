import { useParams } from "react-router-dom";
import SeguimientoPedido from "./SeguimientoPedido";

const SeguimientoPedidoWrapper = () => {
  const { pedidoId } = useParams();
  return <SeguimientoPedido pedidoId={pedidoId} />;
};

export default SeguimientoPedidoWrapper;
