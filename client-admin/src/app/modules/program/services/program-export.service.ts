import { Injectable } from "@angular/core";
import { Event } from "app/schema/event";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, Table, TableBorders, TableCell, TableRow, WidthType } from "docx";
import { saveAs } from "file-saver";
import { DateTime } from "luxon";
import { from } from "rxjs";
import { groupBy, mergeMap, toArray } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ProgramExportService {

  export(events: Event[]) {

    const groupedEvents: Event[][] = [];
    from(events).pipe(
      groupBy(event => `${event.dateFrom},${event.dateTill}`),
      mergeMap(group => group.pipe(toArray()))
    ).subscribe(group => groupedEvents.push(group));

    const sortedGroupedEvents = groupedEvents.sort((e1, e2) => {
      const e1Millis = DateTime.fromISO(e1[0].dateTill).toMillis();
      const e2Millis = DateTime.fromISO(e2[0].dateTill).toMillis();

      if (e1Millis > e2Millis) return 1;
      if (e1Millis < e2Millis) return -1;
      return 0;
    });

    const months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
    const days = ["po", "út", "st", "čt", "pá", "so", "ne"];


    const rows: TableRow[] = [];

    let lastWrittenMonth: number | undefined;
    sortedGroupedEvents.forEach(events => {

      if (events[0].dateFrom) {
        const monthNumber = DateTime.fromISO(events[0].dateFrom).month - 1;
        if (lastWrittenMonth !== monthNumber) {
          lastWrittenMonth = monthNumber;

          rows.push(new TableRow({
            children: [new TableCell({
              borders: TableBorders.NONE,
              columnSpan: 2,
              children: [
                new Paragraph({
                  text: months[monthNumber],
                  heading: HeadingLevel.HEADING_2,
                })
              ]
            })]
          }));
        }
      }

      const formattedDateFrom = DateTime.fromISO(events[0].dateFrom).toFormat("d. M.");
      const formattedDateTill = DateTime.fromISO(events[0].dateTill).toFormat("d. M.");
      const dayFrom = DateTime.fromISO(events[0].dateFrom).weekday - 1;
      const dayTill = DateTime.fromISO(events[0].dateTill).weekday - 1;

      const getLeftEventCell = (empty: boolean) => (
        new TableCell({
          borders: TableBorders.NONE,
          width: {
            type: WidthType.PERCENTAGE,
            size: 20
          },
          children: empty ? [] : [
            new Paragraph({
              text: `${days[dayFrom]} - ${days[dayTill]}`,
              style: "heading3Spacing"
            }),
            new Paragraph({
              text: `${formattedDateFrom} - ${formattedDateTill}`,
              style: "normal"
            })]
        })
      );


      rows.push(...events.map((event, index) => {
        return (
          new TableRow({
            children: [
              getLeftEventCell(index !== 0),
              new TableCell({
                borders: TableBorders.NONE,
                width: {
                  type: WidthType.PERCENTAGE,
                  size: 80
                },
                children: [
                  new Paragraph({ text: event.name, heading: HeadingLevel.HEADING_3 }),
                  new Paragraph({ text: event.description, style: "normal" }),
                  new Paragraph({
                    text: event.leaders && (event.leaders?.length || 0) > 0
                      ? `Vede: ${event.leaders.map(l => `${l.nickname}(${l.contacts?.mobile || "?"})`).join(", ")}`
                      : "", style: "normal"
                  })
                ]
              })
            ]
          })
        );
      })
      );
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "Plán činnnosti vodácké skupiny ŠÁN na _ až _ 20__",
            heading: HeadingLevel.HEADING_1
          }),
          new Table({
            width: {
              type: WidthType.PERCENTAGE,
              size: 100
            },
            rows
          })
        ]

      }],
      styles: {
        default: {
          heading1: {
            run: {
              size: 56,
              bold: true,
              underline: {},
              font: "Arial"
            },
            paragraph: {
              spacing: {
                after: 300,
              },
              alignment: AlignmentType.CENTER
            },
          },
          heading2: {
            run: {
              size: 40,
              bold: true,
              font: "Arial"
            },
          },
          heading3: {
            run: {
              size: 24,
              bold: true,
              font: "Arial"
            },
            paragraph: {
              spacing: {
                before: 200
              }
            }
          },
        },
        paragraphStyles: [{
          id: "normal",
          name: "Normal",
          run: {
            font: "Arial",
            size: 24
          }
        }, {
          id: "heading3Spacing",
          name: "Heading 3 spacing",
          basedOn: "normal",
          paragraph: {
            spacing: {
              before: 200
            }
          }
        }
        ]
      },
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "program.docx");
    });
  }
}