'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationComponent({url, offset, limit, length, total}) {
    const totalPages = Math.ceil(total / limit)
    const page       = Math.floor(offset / limit) + 1

    const createPageView = (page, currentPage) => {
        return (
            <PaginationItem key={page}>
                <PaginationLink isActive={currentPage == page} href={url + page}>{page}</PaginationLink>
            </PaginationItem>
        )
    }

    const createBreakView = (page) => {
        return (
            <PaginationItem key={page}>
                <PaginationLink href={url + page}><PaginationEllipsis /></PaginationLink>
            </PaginationItem>
        )
    }

    const pagination = (currentPage, pageCount, pageRangeDisplayed) => {
        const items = [];

        const marginPagesDisplayed = 2

        if (pageCount <= pageRangeDisplayed) {
            for (let page = 1; page <= pageCount; page++) {
                items.push(createPageView(page, currentPage));
            }
        } else {
            let leftSide  = pageRangeDisplayed / 2;
            let rightSide = pageRangeDisplayed - leftSide;

            // If the selected page index is on the default right side of the pagination,
            // we consider that the new right side is made up of it (= only one break element).
            // If the selected page index is on the default left side of the pagination,
            // we consider that the new left side is made up of it (= only one break element).
            if (currentPage > pageCount - pageRangeDisplayed / 2) {
                rightSide = pageCount - currentPage;
                leftSide  = pageRangeDisplayed - rightSide;
            } else if (currentPage < pageRangeDisplayed / 2) {
                leftSide  = currentPage;
                rightSide = pageRangeDisplayed - leftSide;
            }

            let breakView;

            // First pass: process the pages or breaks to display (or not).
            const pagesBreaking = [];
            for (let page = 1; page <= totalPages; page++) {
                // If the page index is lower than the margin defined,
                // the page has to be displayed on the left side of
                // the pagination.
                if (page <= marginPagesDisplayed) {
                    pagesBreaking.push({
                        type: 'page', 
                        page, 
                        display: createPageView(page, currentPage)});
                    continue;
                }

                // If the page index is greater than the page count
                // minus the margin defined, the page has to be
                // displayed on the right side of the pagination.
                if (page > totalPages - marginPagesDisplayed) {
                    pagesBreaking.push({
                        type: 'page', 
                        page, 
                        display: createPageView(page, currentPage)});                    
                    continue;
                }

                // If it is the first element of the array the rightSide need to be adjusted,
                //  otherwise an extra element will be rendered
                const adjustedRightSide = currentPage === 1 && pageRangeDisplayed > 1 ? rightSide : rightSide - 1;

                // If the page index is near the selected page index
                // and inside the defined range (pageRangeDisplayed)
                // we have to display it (it will create the center
                // part of the pagination).
                if (
                    page >= currentPage - leftSide &&
                    page <= currentPage + adjustedRightSide
                    ) {
                    pagesBreaking.push({
                        type: 'page', 
                        page, 
                        display: createPageView(page, currentPage)});
                    continue;
                }

                // If the page index doesn't meet any of the conditions above,
                // we check if the last item of the current "items" array
                // is a break element. If not, we add a break element, else,
                // we do nothing (because we don't want to display the page).
                if (
                    pagesBreaking.length > 0 &&
                    pagesBreaking[pagesBreaking.length - 1].display !== breakView &&
                    // We do not show break if only one active page is displayed.
                    (pageRangeDisplayed > 0 || marginPagesDisplayed > 0)
                ) {
                    breakView = createBreakView(page)

                    pagesBreaking.push({ type: 'break', page, display: breakView });
                }
            }

            // Second pass: we remove breaks containing one page to the actual page.
            pagesBreaking.forEach((pageElement, i) => {
                // 1 2 3 4 5 6 7 ... 9 10
                //         |
                // 1 2 ... 4 5 6 7 8 9 10
                //             |
                // The break should be replaced by the page.
                if (
                    pageElement.type === 'break' &&
                    pagesBreaking[i - 1] && pagesBreaking[i - 1].type === 'page' &&
                    pagesBreaking[i + 1] && pagesBreaking[i + 1].type === 'page' &&
                    pagesBreaking[i + 1].index - pagesBreaking[i - 1].index <= 2
                ) {
                    items.push(createPageView(pageElement.index, currentPage));
                } else {
                    items.push(pageElement.display);
                }
            });
        }

        return items;
    }

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
                            { pagination(page, totalPages, 6) }
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