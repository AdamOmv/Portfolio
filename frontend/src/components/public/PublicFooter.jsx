export default function PublicFooter({ settings }) {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="container-main flex flex-col gap-4 text-sm text-muted-2 md:flex-row md:items-center md:justify-between">
        <div>{settings.footer_text || 'Concu et developpe par Adam Oumarov.'}</div>
        <div>adomv.com</div>
      </div>
    </footer>
  );
}
