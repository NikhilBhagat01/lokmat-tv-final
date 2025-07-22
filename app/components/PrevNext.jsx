import Link from 'next/link';
import React from 'react';

const PrevNext = ({ prevUrl = '', nextUrl = '' }) => {
  return (
    <>
      <div className="tempclass">
        {prevUrl && (
          <Link className="prev" href={prevUrl}>
            Prev
          </Link>
        )}

        {nextUrl && (
          <Link className="next" href={nextUrl}>
            Next
          </Link>
        )}
      </div>
    </>
  );
};

export default PrevNext;
