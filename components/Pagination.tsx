'use client';

import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationComponent({url, offset, limit, length, total}) {
    const totalPages = Math.ceil(total / limit)
    const page       = Math.floor(offset / limit) + 1

    return ( 
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
            <div>
                <p className="text-sm leading-5">
                    显示
                    <span className="font-medium"> { length ? offset + 1 : 0 } </span>
                    到
                    <span className="font-medium"> { length + offset} </span>
                    （共
                    <span className="font-medium"> { total } </span>
                    个结果）
                </p>
            </div>
            <div>
                <nav className="relative z-0 inline-flex shadow-sm">
                    <Pagination>
                        <PaginationContent>
                            {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href={url + (page - 1)} />
                            </PaginationItem>
                            )}
                            {function() {
                                let pages = []
                                for (let i = 1; i <= totalPages; i++){
                                    const href = url + i;
                                    if (i == page) {
                                        pages.push(<PaginationItem><PaginationLink isActive href={href}>{i}</PaginationLink></PaginationItem>)
                                    } else {
                                        pages.push(<PaginationItem><PaginationLink href={href}>{i}</PaginationLink></PaginationItem>)
                                    }
                                }
                                return pages
                                }()
                            }
                            {page < totalPages && (
                            <PaginationItem>
                                <PaginationNext href={url + (page + 1)} />
                            </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </nav>
            </div>
        </div>
    );
}