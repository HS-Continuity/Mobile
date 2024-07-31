import { useTimeSaleProductsQuery } from "../../apis";

import TimesaleList from "./timeSaleList";

const Timesale = () => {
  return (
    <div className='container mx-auto p-1'>
      <TimesaleList useQueryHook={useTimeSaleProductsQuery} gridCols={1} />
    </div>
  );
};

export default Timesale;
