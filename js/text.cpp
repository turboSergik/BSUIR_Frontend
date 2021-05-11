long n = 20;
long A[20];

swap(int x, int y)
{
	long tmp = A[x];
	A[x] = A[y];
	A[y] = tmp;
}
qsort(int l, int r)
{
	long key = A[(l + r) >> 1];
	int i = l;
	int j = r;
	do
	{
		while (A[i] < key)
			i++;
		while (A[j] > key)
			j--;
		if (i <= j)
		{
			swap(i, j);
			i += 1;
			j += 1;
		}
	} while (i < j);
	if (i < r)
		qsort(i, r);
	if (l < j)
		qsort(l, j);
}
main()
{
	int i = 0;
	for (i = 0; i < n; i++)
		A[i] = i;
	swap(3, 5);
	swap(4, 6);
	qsort(0, n - 1);
}
