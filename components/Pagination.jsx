export const Pagination = ({ tasksPerPage, totalTasks, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav className="my-4">
        <ul className="flex list-none">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`mx-1 cursor-pointer border p-2 border-sky-900 ${currentPage === number ? 'font-bold' : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  