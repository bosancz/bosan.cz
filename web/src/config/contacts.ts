import { Contact } from "app/shared/schema/contact";

export interface Contacts {
  leaders: Contact[];
  monday: Contact[];
  wednesday: Contact[];
}

export const Contacts: Contacts = {
  leaders: [
    {
      name: "Jaroslav Havelík",
      role: "hlavní vedoucí",
      email: "jara@bosan.cz",
      nickname: "Jára",
      mobile: "721 833 194",
      avatar: "/assets/img/contact-placeholders/024-man-2.png"
    },
    {
      name: "Jan Svoboda",
      role: "hospodář",
      email: "tycka@bosan.cz",
      nickname: "Tyčka",
      mobile: "606 939 753",
      avatar: "/assets/img/contact-placeholders/014-man-12.png"
    },
    {
      name: "Marta Kuželková",
      nickname: "Máša",
      avatar: "/assets/img/contact-placeholders/011-woman-5.png",
      role: "člen vedení",
      email: "masa@bosan.cz",
      mobile: "732 649 157"
    },
    {
      name: "Filip Hruška",
      nickname: "Fíla",
      avatar: "/assets/img/contact-placeholders/031-boy-2.png",
      role: "člen vedení",
      email: "fila@bosan.cz",
      mobile: "774 533 358"
    },
    {
      name: "Šimon Zeman",
      role: "člen vedení",
      email: "sumak@bosan.cz",
      nickname: "Šumák",
      mobile: "703 126 142",
      avatar: "/assets/img/contact-placeholders/029-boy-4.png"
    },
    {
      name: "Václav Čechmánek",
      nickname: "Pašík",
      avatar: "/assets/img/contact-placeholders/028-boy-5.png",
      role: "člen vedení",
      email: "pasik@bosan.cz",
      mobile: "731 651 145"
    },
    {
      name: "Ondřej Pěknice",
      nickname: "Vokurka",
      avatar: "/assets/img/contact-placeholders/032-boy-1.png",
      role: "člen vedení",
      email: "vokurka@bosan.cz",
      mobile: "725 739 088"
    },
    {
      name: "David Tvrdý",
      nickname: "Mazák",
      avatar: "/assets/img/contact-placeholders/023-man-3.png",
      role: "revizor",
      email: "mazak@bosan.cz",
      mobile: "731 041 415"
    },
    {
      name: "Jan Žák",
      nickname: "Žabiš",
      avatar: "/assets/img/contact-placeholders/027-boy-6.png",
      role: "mluvčí za KONDOR",
      email: "zabis@bosan.cz",
      mobile: "777 840 316"
    }
  ],
  monday: [
    {
      name: "Jiří Pěknice",
      nickname: "Sirka",
      avatar: "/assets/img/contact-placeholders/001-man-13.png",
      role: "5. oddíl",
      email: "sirka@bosan.cz",
      mobile: "725 739 089"
    },
    {
      name: "Vít Suchomel",
      nickname: "Kšilt",
      avatar: "/assets/img/contact-placeholders/019-man-7.png",
      role: "7. oddíl",
      email: "ksilt@bosan.cz",
      mobile: "792 369 583"
    },
    {
      name: "Amálie Peláková",
      nickname: "Číča",
      avatar: "/assets/img/contact-placeholders/003-woman-13.png",
      role: "8. oddíl",
      email: "cica@bosan.cz",
      mobile: "737 461 023"
    },
    {
      name: "Jiří Kubíček",
      nickname: "Lef",
      avatar: "/assets/img/contact-placeholders/028-boy-5.png",
      role: "22. oddíl",
      email: "lef@bosan.cz",
      mobile: "605 340 502"
    }
  ],
  wednesday: [
    {
      name: "Kateřina Sazimová",
      nickname: "Čip",
      avatar: "/assets/img/contact-placeholders/010-woman-6.png",
      role: "3. oddíl",
      email: "cip@bosan.cz",
      mobile: "733 374 326"
    },
    {
      name: "Emma Hrdličková",
      nickname: "Ředkvička",
      avatar: "/assets/img/contact-placeholders/006-woman-10.png",
      role: "4. oddíl",
      email: "redkvicka@bosan.cz",
      mobile: "605 498 958"
    },
    {
      name: "Jakub Dlouhý",
      nickname: "Forest",
      avatar: "/assets/img/contact-placeholders/030-boy-3.png",
      role: "6. oddíl",
      email: "forest@bosan.cz",
      mobile: "773 659 353"
    }
  ]
};
