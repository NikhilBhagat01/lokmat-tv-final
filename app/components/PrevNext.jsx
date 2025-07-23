import Link from 'next/link';
import React from 'react';

const PrevNext = ({ prevUrl = '', nextUrl = '' }) => {
  return (
    <>
      <div className="tempclass">
        {prevUrl && (
          <Link className="prev" href={prevUrl}>
            Previous Page
          </Link>
        )}

        {nextUrl && (
          <Link className="next" href={nextUrl}>
            Next Page
          </Link>
        )}
      </div>
    </>
  );
};

export default PrevNext;
