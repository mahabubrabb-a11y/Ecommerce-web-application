import ReactPaginate from "react-paginate";

const Paginate = ({ handelPageClick, totalCount, per_page, page_no }) => {
  return (
    <>
      <ReactPaginate
        className='pagination common-pagination'
        previousLabel='<'
        nextLabel='>'
        pageClassName='page-item'
        activeClassName='pagination'
        pageLinkClassName=' page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link flx-align gap-2 flex-nowrap'
        nextClassName='page-item'
        nextLinkClassName='page-link flx-align gap-2 flex-nowrap'
        activeLinkClassName=' pagination active'
        breakLabel='...'
        pageCount={totalCount / per_page}
        forcePage={page_no - 1}
        pageRangeDisplayed={3}
        onPageChange={handelPageClick}
        type='button'
      />
    </>
  );
};

export default Paginate;