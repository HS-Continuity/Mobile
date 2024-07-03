import Item from "./Item";

const Content = () => {
  return (
    <>
      <Item
        image='https://via.placeholder.com/150'
        title='Item 1'
        price='10,000'
        detail='Item Detail 1'
        count={1}
      />
      <Item
        image='https://via.placeholder.com/150'
        title='Item 2'
        price='10,000'
        detail='Item Detail 2'
        count={1}
      />
      <Item
        image='https://via.placeholder.com/150'
        title='Item 3'
        price='10,000'
        detail='Item Detail 3'
        count={1}
      />
    </>
  );
};

export default Content;
