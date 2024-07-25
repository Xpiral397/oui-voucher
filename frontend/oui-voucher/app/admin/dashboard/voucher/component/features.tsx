import { FeatureCard } from "@/app/page";
import { EyeIcon } from "@heroicons/react/outline";
import { DownloadIcon } from "@heroicons/react/outline";
import { SelectorIcon } from "@heroicons/react/outline";
import { ClipboardListIcon } from "@heroicons/react/outline";
import { ArchiveIcon } from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/outline";
import { OnlinePredictionRounded } from "@mui/icons-material";
import { ScrollShadow } from "@nextui-org/react";

export function FeaturesSection() {
  const features = [
    {
      title: "Add New Voucher",
      description: "Create new vouchers easily for payments.",
      icon: <PlusIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/new",
    },
    {
      title: "Delete Voucher",
      description: "Remove unused or expired vouchers.",
      icon: <TrashIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "Archive Voucher",
      description: "Archive old vouchers for record-keeping.",
      icon: <ArchiveIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "View Used Vouchers",
      description: "Check the status of used vouchers.",
      icon: <EyeIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "Generate PDF Invoice",
      description: "Create and download PDF invoices.",
      icon: <DownloadIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "Remote Payment",
      description: "Facilitate remote payments seamlessly.",
      icon: <OnlinePredictionRounded className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "Transaction View",
      description: "View all transactions in one place.",
      icon: <ClipboardListIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
    {
      title: "Voucher Scope Selection",
      description: "Select voucher scopes for different purposes.",
      icon: <SelectorIcon className="h-12 w-12" />,
      link: "/dashboard/voucher/manage",
    },
  ];

  return (
    <div
      className="rounded-md bg-gray-100 dark:bg-gray-900 py-10"
      id="features"
    >
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Features
      </h2>
      <ScrollShadow
        hideScrollBar
        className="w-full lg:max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 justify-center h-[89vh]"
      >
        {features.map((feature, index) => (
          <a href={feature.link}>
            <FeatureCard
              link={feature.link}
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          </a>
        ))}
      </ScrollShadow>
    </div>
  );
}
